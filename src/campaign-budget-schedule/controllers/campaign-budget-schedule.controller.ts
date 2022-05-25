import debug from "debug";
const Op = require('../models').Sequelize.Op;
const axios = require("axios");
const moment = require("moment-timezone");
import {CampaignBudgetSchedule} from "../models";
import express from "express";
const {User} = require('../../users/models')
const {filterUpdateAbleModelKeys} = require("../helper/helpers");
const CampaignAccountingController = require('../../campaign-accounting/controllers/campaign-accounting.controller');
const campaignAccountingCtrl = new CampaignAccountingController();
const AdsApiHelperNewController = require('../../ads/controllers/helper.controller');
const adsApiHelperNewCtrl = new AdsApiHelperNewController();
const AdsApiCampaignController = require("../../ads/controllers/campaign.controller")
const adsApiCampaignCtrl = new AdsApiCampaignController()
const AdsApiBaseController = require('../../ads/controllers/base.controller');
const adsApiBaseCtrl = new AdsApiBaseController();

const {getBudgetMutableURL, getCampaignCriteriaMutableURL} = require("../../common/utils/googleAdsQuery");

require('dotenv').config({ path: '../../../.env' })
const log: debug.IDebugger = debug("app:campaign-budget-schedule-controller");

class CampaignBudgetScheduleController {
    /**
     * for the controller. Will be required to create
     * an instance of the controller
     */
    constructor() {
        this.updateSingleCampaignBudgetSchedule = this.updateSingleCampaignBudgetSchedule.bind(this)
        this.fireDailyCampaignBudgetScheduleEventJob = this.fireDailyCampaignBudgetScheduleEventJob.bind(this)
        this.runRelatedJobTask = this.runRelatedJobTask.bind(this)
        this.updateCampaignBudget = this.updateCampaignBudget.bind(this)
        this.saveCampaignSchedule = this.saveCampaignSchedule.bind(this)
        this.deleteCampaignSchedule = this.deleteCampaignSchedule.bind(this)
        this.getCriterion = this.getCriterion.bind(this)
        this.updateCampaignAccounting = this.updateCampaignAccounting.bind(this)
        this.getCampaignLastChangeEvent = this.getCampaignLastChangeEvent.bind(this)
        this.associateCampaignTask = this.associateCampaignTask.bind(this)
    }

    /**
     * @override
     */
    async index(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const items = await CampaignBudgetSchedule.findAll({
                where: { campaignId: req.query.campaignId },
                include: [{
                    model: User,
                    as: 'user'
                }],
            });
            res.status(200).json(items);
        } catch (err) {
            next(err);
        }
    }

    /**
     * @override
     */
    async store(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const items = [];
            for (let i = 0; i < req.body.campaignBudgetSchedules.length; i++) {
                const element = req.body.campaignBudgetSchedules[i];
                element.createdByUserId = req.authUser ? req.authUser.id : null
                element.status = 'active'
                const item = await CampaignBudgetSchedule.create(element);
                items.push(item)
            }

            if(items && items.length) {
                if(items && items.length) {
                    await this.associateCampaignTask(req, items)
                }
            }

            res.json(items);
        } catch (err) {
            next(err)
        }
    };

    /**
     * @override
     */
    async update(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const items = [];
            for (let i = 0; i < req.body.campaignBudgetSchedules.length; i++) {
                const element = req.body.campaignBudgetSchedules[i];
                element.createdByUserId = req.authUser ? req.authUser.id : null
                element.status = 'active'
                const response = await this.updateSingleCampaignBudgetSchedule(element)
                items.push(response)
            }

            if(items && items.length) {
                await this.associateCampaignTask(req, items)
            }

            return res.json(items);
        } catch (err) {
            next(err);
        }
    };

    /**
     * @override
     */
    async delete(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            if(req.params.id) {
                const item = await CampaignBudgetSchedule.findOne({ where: { id: req.params.id } });
                if (!item) res.json({ message: "Resource Not Found!"}, 404);
                await item.destroy();
                res.json({ message: "Item deleted!" });
            } else if(req.body.ids.length) {
                for (let i = 0; i < req.body.ids.length; i++) {
                    let item = await CampaignBudgetSchedule.findOne({ where: { id: req.body.ids[i] } });
                    if (!item) res.json({ message: "Resource Not Found!"}, 404);
                    await item.destroy()
                    res.json({ message: "Items deleted!" });
                }
            }
        } catch (err) {
            next(err);
        }
    };

    /**
     * @param req
     * @param items
     */
    async associateCampaignTask(req: express.Request, items) {
        const {campaignId, customerId, loginCustomerId, customerTimezone} = items[0]
        const request = {
            body: {
                customerId,
                loginCustomerId,
                campaignId,
            },
            headers: req.headers
        }

        let date = moment.tz(customerTimezone).format('YYYY-MM-DD');

        const hasItemsIncludeToday = items.find(el => moment.tz(el.runDate, customerTimezone).format("YYYY-MM-DD") === date)

        if(hasItemsIncludeToday && Object.keys(hasItemsIncludeToday).length) {
            let item = await CampaignBudgetSchedule.findOne({
                where: { id: hasItemsIncludeToday.id },
                include: [{
                    model: User,
                    as: 'user'
                }],
            });

            if(item) {
                await this.runRelatedJobTask(date, item)
            }
        }
    }

    /**
     * @param runDate
     * @return cbs's
     */
    async getCampaignBudgetSchedules(runDate) {
        try {
            const startDate = moment(runDate).subtract(1, 'days').format('YYYY-MM-DD')
            const endDate = moment(runDate).add(1, 'days').format('YYYY-MM-DD')

            const items = await CampaignBudgetSchedule.findAll({
                where: {
                    runDate: {
                        [Op.between]: [startDate, endDate]
                    },
                    status: 'active'
                },
                include: [{
                    model: User,
                    as: 'user'
                }],
            });
            if (items && items.length) {
                return items.map((item) => {
                    return item.dataValues;
                });
            }
            return items;
        } catch (error) {
            throw error;
        }
    };

    /**
     * fire daily campaign budget schedule cron jobs
     */
    async fireDailyCampaignBudgetScheduleEventJob() {
        console.log(`Cron Job Started at ${moment.tz().format('YYYY-MM-DD HH:mm:ss')}`)

        try {
            let date = moment.tz().format('YYYY-MM-DD HH:mm');
            const schedules = await this.getCampaignBudgetSchedules(date);
            if (schedules && schedules.length) {
                for (let i = 0; i < schedules.length; i++) {
                    await this.runRelatedJobTask(date, schedules[i])
                }
            } else {
                console.log('Nothing to run')
            }
            console.log(`Cron Job Ended at ${moment.tz().format('YYYY-MM-DD HH:mm:ss')}`)
            return true;
        } catch (error) {
            console.log(error.message)
        }
    }

    /**
     * @param date
     * @param cbsItem*
     * fire daily campaign budget schedule cron jobs
     */
    async runRelatedJobTask(date, cbsItem) {

        const clientScheduleDateNow = moment.tz(cbsItem.runDate, cbsItem.customerTimezone).hour(cbsItem.startHour).minute(cbsItem.startMinute)
        const clientScheduleDate = clientScheduleDateNow.format('YYYY-MM-DD')
        const clientScheduleDateTime = clientScheduleDateNow.format('YYYY-MM-DD HH:MM:ss')

        const isBudgetForToday = moment(date).tz(cbsItem.customerTimezone).startOf('day').isSame(clientScheduleDateNow.startOf('day'));

        console.log("=====================")
        console.log(`Start: ${cbsItem.id}`)
        console.log(`BudgetId: ${cbsItem.budgetId}`);
        console.log(`Timezone: ${cbsItem.customerTimezone}`);
        console.log(`Date Comparison: ${moment(date).tz(cbsItem.customerTimezone).startOf('day').format('YYYY-MM-DD')} == ${clientScheduleDateNow.startOf('day').format('YYYY-MM-DD')}`)

        if(isBudgetForToday) {
            console.log(`System Date: ${date} | `, `Customer Schedule Date: ${clientScheduleDate}`)
            cbsItem.refreshToken = cbsItem.user.refreshToken
            const {id, amount, customerId, loginCustomerId, campaignId, refreshToken} = cbsItem
            const req = {
                body: {
                    customerId, loginCustomerId, campaignId, refreshToken
                },
                authUser: {
                    email: ''
                },
                headers: {
                    'refresh-token': refreshToken
                }
            }

            let history = ''
            if(parseInt(amount) > 0) {
                //Todo: patch Campaign accounting
                // const campaignAccount = await campaignAccountingCtrl.findOneByCampaignId(campaignId)

                //Todo: update campaign budget amount micros- DONE
                console.log(campaignId,'Updating campaign budget...')
                await this.updateCampaignBudget(cbsItem)
                console.log('Updated campaign budget.')

                //Todo: delete schedule criteria (Typically weekdays run time) - DONE
                console.log(campaignId,'For saving updated schedule time, Deleting existing schedule weekdays...')
                await this.deleteCampaignSchedule(req, cbsItem)
                console.log('Deleted existing schedule weekdays time.')

                //Todo: update schedule criteria (Typically weekdays run time) - DONE
                console.log(campaignId,'Saving changed campaign schedule weekdays time...')
                await this.saveCampaignSchedule(req, cbsItem)
                console.log('Saved campaign schedule weekdays time.')
            } else {
                //Todo: delete schedule criteria (Typically weekdays run time) - DONE
                console.log(campaignId,'As budget amount is 0; Deleting campaign schedule weekdays...')
                await this.deleteCampaignSchedule(req, cbsItem)
                console.log('Deleted campaign schedule weekdays time.')
            }

            //Todo: update campaign budget schedule status - DONE
            console.log(campaignId,"Updating schedule status as executed...")
            await this.updateSingleCampaignBudgetSchedule({id: id, dateExecuted: clientScheduleDateTime, status: 'executed'})
            console.log('Updated schedule status as executed.')

            //Todo: set amount micros cost to the campaign accounting - DONE
            await this.updateCampaignAccounting(req, campaignId)

            //Todo: get campaign history and sent it to the client team Emails - DONE
            //Todo: Have an issue, not returning latest history!!
            history = await this.getCampaignLastChangeEvent(req, cbsItem)

            //Todo: Send email to associate user about the job - DONE
            console.log('Sending email to team emails...')
            await adsApiHelperNewCtrl.sendMail(req, cbsItem, history)
        }
        console.log(`End: ${cbsItem.id}`)
    }

    /**
     * @param req
     * @param schedule
     * update campaign budget
     */
    async getCampaignLastChangeEvent(req: express.Request, schedule) {
        console.log('Getting campaign change history..')
        let history = await adsApiCampaignCtrl.getSingleCampaignHistory(req, schedule.timezone);
        history = history.map((item) => {
            const { change_event, campaign } = item;
            let budgetAmount = null;
            let name = "__";
            let changedField = "";
            if (change_event?.new_resource?.campaign_budget?.amount_micros) {
                budgetAmount = change_event.new_resource.campaign_budget.amount_micros / 1000000;
                budgetAmount = "$" + budgetAmount;
            } else {
                budgetAmount = "--";
            }
            if (campaign?.name) {
                name = campaign.name;
            }
            if(change_event?.changed_fields?.paths) {
                changedField = change_event?.changed_fields?.paths[0]
            }
            return {
                scheduledBy: change_event.user_email,
                dateScheduled: moment.tz(moment(change_event.change_date_time), schedule.timezone).format('YYYY-MM-DD'),
                runDate: campaign.start_date,
                name,
                budgetAmount,
                change_event_date: change_event.change_date_time,
                changedField: changedField
            };
        });
        history = history.filter(his => his.changedField === 'amount_micros') //filtering for getting only amount micros field changed
        return history
    }

    /**
     * @param schedule
     * update campaign budget
     */
    async updateCampaignBudget(schedule) {
        const { loginCustomerId, amount, budgetId, customerId, refreshToken} = schedule
        console.log('loginCustomerId, amount, budgetId, customerId, refreshToken', loginCustomerId, amount, budgetId, customerId, refreshToken)
        const {access_token} = await adsApiBaseCtrl.getAccessToken(refreshToken);
        const config = {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "developer-token": process.env.DEVELOPER_TOKEN,
                "login-customer-id": loginCustomerId,
                "Content-Type": "application/json",
            },
        }

        const URL = getBudgetMutableURL(customerId);
        try {
            const budgetData = {
                operations: [
                    {
                        update: {
                            resourceName: `customers/${customerId}/campaignBudgets/${budgetId}`,
                            amountMicros: parseInt(amount),
                        },
                        updateMask: "amountMicros",
                    },
                ],
            };
            const response = await axios.post(URL, budgetData, config);
            return response.data;
        } catch (err) {
            console.log('err', err.message)
        }
    }

    /**
     * @param req
     * @param schedule
     * get campaigns schedule criteria
     */
    async getCriterion(req: express.Request, schedule) {
        const {campaignId, loginCustomerId, refreshToken, customerId} = schedule
        try {
            const query = `SELECT campaign_criterion.criterion_id, campaign_criterion.ad_schedule.day_of_week FROM campaign_criterion WHERE campaign.id = ${campaignId}`;
            const customer = await adsApiBaseCtrl.getCustomer(req);
            const criteria = await customer.query(query);
            return criteria.filter(el => {
                if(el.campaign_criterion && el.campaign_criterion.ad_schedule) {
                    return el
                }
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    /**
     * @param req
     * @param schedule
     * create or update campaign schedule
     */
    async saveCampaignSchedule(req: express.Request, schedule) {
        const {customerId, campaignId, refreshToken, loginCustomerId} = schedule
        const URL = getCampaignCriteriaMutableURL(customerId);
        const {access_token} = await adsApiBaseCtrl.getAccessToken(refreshToken);
        const config = {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "developer-token": process.env.DEVELOPER_TOKEN,
                "login-customer-id": loginCustomerId,
                "Content-Type": "application/json",
            },
        }

        try {
            const createObject = {
                create: {
                    campaign: `customers/${customerId}/campaigns/${campaignId}`,
                    adSchedule: {
                        endHour: schedule.endHour,
                        endMinute: schedule.endMinute,
                        startHour: schedule.startHour,
                        startMinute: schedule.startMinute,
                        dayOfWeek: schedule.dayOfTheWeek,
                    },
                },
            };

            const data = {
                operations: [],
            };

            const obj = JSON.parse(JSON.stringify(createObject));
            data.operations.push(obj);

            return await axios.post(URL, data, config);
        } catch (err) {
            console.log(err.message)
        }
    }

    /**
     * @param req
     * @param schedule
     * @returns remove campaign schedule by internal method call
     * Ref: https://developers.google.com/google-ads/api/rest/reference/rest/v10/CampaignCriterionOperation
     */
    async deleteCampaignSchedule(req: express.Request, schedule) {
        //get campaign criterion and remove if exists
        const criteria = await this.getCriterion(req, schedule)
        let hasAdScheduleResourceName = ''

        if(criteria && criteria.length) {
            for(let i = 0; i < criteria.length; i++) {
                const criterion = criteria[i].campaign_criterion
                if(criterion && criterion.ad_schedule.day_of_week === parseInt(schedule.dayOfTheWeek)) {
                    hasAdScheduleResourceName = criterion.resource_name
                }
            }
        }

        const {customerId, refreshToken, loginCustomerId} = schedule
        const URL = getCampaignCriteriaMutableURL(customerId);
        const {access_token} = await adsApiBaseCtrl.getAccessToken(refreshToken);

        const config = {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "developer-token": process.env.DEVELOPER_TOKEN,
                "login-customer-id": loginCustomerId,
                "Content-Type": "application/json",
            },
        }

        const removeObject = (name) => {
            return {
                remove: name,
            };
        };

        try {
            const data = {
                operations: [],
            };
            const obj = JSON.parse(JSON.stringify(removeObject(hasAdScheduleResourceName)));
            data.operations.push(obj);

            return await axios.post(URL, data, config);
        } catch (err) {
            console.log(err.message)
        }
    };

    /**
     * @param element
     * create or update campaign budget schedule
     */
    async updateSingleCampaignBudgetSchedule(element) {
        try {
            let item = await CampaignBudgetSchedule.findOne({ where: { id: element.id } });
            if(item) {
                const updateAbleObject = {};
                updateAbleObject.body = element;
                item = filterUpdateAbleModelKeys(this._model, item, updateAbleObject);
                return await item.save();
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    /**
     * @param req
     * @param campaignId
     * create or update campaign accounting for the campaign
     */
    async updateCampaignAccounting(
        req: express.Request,
        campaignId
    ) {
        const cbsItems = await this._model.findAll({
            where: { campaignId: campaignId }
        });

        const campaign = await adsApiCampaignCtrl.getCampaignTotalAmountMicros(req, campaignId)

        console.log('campaign', campaign)
        let totalCostAmount = 0
        if(campaign && campaign.length) {
            totalCostAmount = campaign[0].metrics?.cost_micros
        }
        const totalBudgetAmount = cbsItems.reduce((n, {amount}) => n + parseInt(amount), 0)
        const totalCampaignRunDays = cbsItems.length
        const totalCampaignPassedDays = cbsItems.filter(el => el.status.toLowerCase() === 'executed').length
        const totalCampaignRemainingDays= totalCampaignRunDays - totalCampaignPassedDays
        const status = 'active'

        const campaignAccount = await campaignAccountingCtrl.findOneByCampaignId(campaignId)
        if(campaignAccount) {
            campaignAccount.totalBudgetAmount = totalBudgetAmount
            campaignAccount.totalCampaignRunDays = totalCampaignRunDays
            campaignAccount.totalCampaignPassedDays = totalCampaignPassedDays
            campaignAccount.totalCampaignRemainingDays = totalCampaignRemainingDays
            campaignAccount.totalCostAmount = totalCostAmount
            campaignAccount.status = status
            await campaignAccount.save()
        } else {
            const data = {
                campaignId: campaignId,
                totalBudgetAmount: totalBudgetAmount,
                totalCampaignRunDays: totalCampaignRunDays,
                totalCampaignPassedDays: totalCampaignPassedDays,
                totalCampaignRemainingDays: totalCampaignRemainingDays,
                totalCostAmount: totalCostAmount,
                status: status
            }
            await campaignAccountingCtrl.saveData(data);
        }
    }
}

export default new CampaignBudgetScheduleController();
