const axios = require("axios");
import  express from "express";
import AdsApiBaseController from "./base.controller";
import AdsApiScheduleController from "./schedule.controller";
const adsApiScheduleCtrl = new AdsApiScheduleController();
const moment = require("moment-timezone");

import { getCampaignMutableURL } from "../../common/utils/googleAdsQuery";

export default class AdsApiCampaignController extends AdsApiBaseController{
    /**
     * for the controller. Will be required to create
     * an instance of the controller
     */
    constructor() {
        super();
        this.getAllCampaigns = this.getAllCampaigns.bind(this)
        // this.updateCampaignBudget = this.updateCampaignBudget.bind(this)
        this.updateCampaignEndDate = this.updateCampaignEndDate.bind(this)
        this.updateCampaignStartDate = this.updateCampaignStartDate.bind(this)
        this.getClientCampaigns = this.getClientCampaigns.bind(this)
        this.getCampaignLogs = this.getCampaignLogs.bind(this)
        this.updateCampaignStatus = this.updateCampaignStatus.bind(this)
        this.getSingleCampaignHistory = this.getSingleCampaignHistory.bind(this)
        this.getCampaignTotalAmountMicros = this.getCampaignTotalAmountMicros.bind(this)
        this.getAdGroupMetricsByDate = this.getAdGroupMetricsByDate.bind(this)
    }

    /**
     * @param {Object} req The request object
     * @param {Object} res The response object
     * @param {function} next The callback to the next program handler
     * @returns all campaigns by API route call
     * */
    async getAllCampaigns(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const query = "SELECT campaign_budget.id,campaign_budget.amount_micros, campaign_budget.name, customer.time_zone, customer.resource_name, customer.manager, customer.id, customer.descriptive_name,metrics.cost_micros, FROM campaign";
            const customer = await super.getCustomer(req);
            const result = await customer.query(query);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * get a customer data (conditional)
     * get a campaign's criteria (schedules data) by campaign id (conditional)
     * get client all campaigns
     * @returns getClientCampaigns by API route call
     *
     */
    async getClientCampaigns(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            let singleCampaignQuery = "";
            let customerData = null;
            let criterias = null;
            const {campaignId, timezone} = req.query
            if (campaignId) {
                let query = `SELECT customer.descriptive_name, customer.id, customer.time_zone FROM customer WHERE customer.id = ${req.query.customerId}`;
                const customer = await super.getCustomer(req);
                customerData = await customer.query(query);

                singleCampaignQuery = `AND campaign.id = ${campaignId}`;

                criterias = await adsApiScheduleCtrl.getCriterionByCampaignId(req, next, campaignId);
            }

            let timezoneQuery = "";
            if (timezone) {
                timezoneQuery = `AND customer.time_zone = '${timezone}'`;
            }
            const campaignBudgetQuery = "campaign_budget.id, campaign_budget.amount_micros, campaign_budget.total_amount_micros, campaign_budget.type, campaign_budget.explicitly_shared, campaign_budget.has_recommended_budget, campaign_budget.period, campaign_budget.recommended_budget_amount_micros,";
            let query = `SELECT campaign.campaign_budget, ${campaignBudgetQuery} campaign.id, campaign.labels, campaign.name, campaign.resource_name, campaign.payment_mode, campaign.status, campaign.start_date, campaign.end_date, metrics.cost_micros FROM campaign WHERE customer.id = ${req.query.customerId} ${singleCampaignQuery} ${timezoneQuery}`;

            const customerAgain = await super.getCustomer(req);
            const campaigns = await customerAgain.query(query);
            const object = {
                campaigns: [],
                criterias: [],
                customerData: null
            };

            object.campaigns = campaigns;
            if (criterias && criterias.length) {
                criterias = criterias.filter((el) => {
                    if (el.campaign_criterion.ad_schedule) {
                        el.campaign_criterion.campaignCriteriaId = el.campaign_criterion.resource_name.split("campaignCriteria/")[1];
                        return el;
                    }
                });
                object.criterias = criterias;
            }

            if (customerData) {
                object.customerData = customerData;
            }

            res.json({ ...object });
        } catch (err) {
            next(err);
        }
    };

    /**
     *
     * @param req
     * @param campaignId
     * @returns get campaign metrics cost micros
     *
     */
    async getCampaignTotalAmountMicros(
        req: express.Request,
        campaignId
    ) {
        const query = `SELECT
    campaign.start_date,
    campaign.end_date, 
    campaign.name,
    campaign.id,
    campaign.campaign_budget,
    campaign_budget.amount_micros, 
    campaign_budget.total_amount_micros,
    metrics.cost_micros,
    campaign.status
    FROM campaign
    WHERE campaign.id = ${campaignId}`;
        try {
            const customer = await super.getCustomer(req);
            return await customer.query(query);
        } catch (error) {
            console.log('error', error)
            throw error
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * get a campaign's logs as history data
     * @returns getCampaignLogs by API route call
     *
     */
    async getCampaignLogs(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const timezone = req?.query.timezone
        req.body.campaignId  = req?.query.campaignId
        let history = await this.getSingleCampaignHistory(req, timezone, 50)
        let historyData = history.map((item) => {
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
                dateScheduled: moment.tz(moment(change_event.change_date_time), timezone).format('YYYY-MM-DD'),
                runDate: campaign.start_date,
                name,
                budgetAmount,
                change_event_date: change_event.change_date_time,
                changedField: changedField
            };
        });
        historyData = historyData.filter(his => his['changedField'] === 'amount_micros') //filtering for getting only amount micros field changed
        return res.json(historyData)
    };

    /**
     *
     * @param req
     * @param res
     * @param next
     * update status of a campaign
     * @returns by API route call
     *
     */
    async updateCampaignStatus(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const {customerId, campaignId} = req.body;
        const URL = getCampaignMutableURL(customerId);
        const config = await super.getAxiosConfig(req, res, next);
        try {
            const data = {
                operations: [
                    {
                        update: {
                            resourceName: `customers/${customerId}/campaigns/${campaignId}`,
                            status: req.body.status,
                        },
                        updateMask: "status",
                    },
                ],
            };

            const result = await axios.post(URL, data, config);
            res.json(result);

        } catch (error) {
            if (error?.response?.data?.error?.details[0]?.errors) {
                error.errors = error.response.data.error.details[0].errors;
                next(error.errors);
            }
            next(error);
        }
    };

    /**
     * @param req
     * @param timezone
     * @param limit
     * Update update campaign end date
     * @returns campaign
     */
    async getSingleCampaignHistory(
        req: express.Request,
        timezone = null,
        limit = 30
    ) {
        try {
            const startDate = moment.tz(moment.tz(), timezone).subtract(28, 'days').format('YYYY-MM-DD HH:mm:ss')
            const endDate = moment.tz(moment.tz(), timezone).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')

            console.log('History search', 'start date', startDate, 'endDate', endDate)
            const campaignId = req?.body.campaignId;

            // await this.getAdGroupMetricsByDate(req, timezone)
            const query = `SELECT
              change_event.change_date_time,  
              change_event.user_email, 
              change_event.new_resource, 
              change_event.old_resource, 
              change_event.changed_fields, 
              change_event.campaign,
              campaign.start_date,
              campaign.end_date, 
              campaign.name,
              campaign.id
              FROM change_event
              WHERE change_event.change_date_time <= '${endDate}'
              AND change_event.change_date_time >= '${startDate}'
              AND campaign.id = ${campaignId}
              AND change_event.change_resource_type IN ('CAMPAIGN', 'CAMPAIGN_BUDGET')
              ORDER BY change_event.change_date_time DESC LIMIT ${limit}`;

            const customer = await super.getCustomer(req);

            return await customer.query(query);
        } catch (error) {
            console.log(error.message)
            console.log('Error from get single campaign history: ', error.message)
        }
    };

    /**
     *
     * @param req
     * @param res
     * @param next
     * Update update campaign end date
     * @returns campaign
     *
     */
    async updateCampaignEndDate(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const config = await super.getAxiosConfig(req, res, next);
        const {customerId, endDate, campaignId} = req.body;
        const URL = getCampaignMutableURL(customerId);

        const campaignData = {
            operations: [
                {
                    update: {
                        resourceName: `customers/${customerId}/campaigns/${campaignId}`,
                        endDate: endDate
                    },
                    updateMask: "endDate",
                },
            ],
        };

        try {
            const result = await axios.post(URL, campaignData, config);
            if(result) {
                res.json({
                    success: true,
                });
            }
        } catch (err) {
            if (err?.response?.data?.error?.details[0]?.errors) {
                err.errors = err.response.data.error.details[0].errors;
                next(err.errors);
            }
            next(err);
        }
    };

    /**
     *
     * @param req
     * @param res
     * @param next
     * Update update campaign start date
     * @returns campaign
     *
     */
    async updateCampaignStartDate(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const config = await super.getAxiosConfig(req, res, next);
        const {customerId, startDate, campaignId} = req.body;
        const URL = getCampaignMutableURL(customerId);

        const campaignData = {
            operations: [
                {
                    update: {
                        resourceName: `customers/${customerId}/campaigns/${campaignId}`,
                        startDate: startDate
                    },
                    updateMask: "startDate",
                },
            ],
        };

        try {
            const result = await axios.post(URL, campaignData, config);
            if(result) {
                res.json({
                    success: true,
                });
            }
        } catch (err) {
            if (err?.response?.data?.error?.details[0]?.errors) {
                err.errors = err.response.data.error.details[0].errors;
                next(err.errors);
            }
            next(err);
        }
    };

    /**
     *
     * @param req
     * @param timezone
     * get campaign date wise cost
     * @returns campaign ad group segments
     *
     */
    async getAdGroupMetricsByDate(
        req: express.Request,
        timezone
    ) {
        const startDate = moment.tz(moment(), timezone).subtract(10, 'days').format('YYYY-MM-DD')
        const endDate = moment.tz(moment(), timezone).format('YYYY-MM-DD')
        try {
            // const query = "SELECT metrics.cost_micros, campaign.id, campaign.name, metrics.interactions, metrics.impressions, metrics.clicks, metrics.average_cpm, metrics.average_cpv, metrics.average_cpe, metrics.average_cpc, metrics.average_cost, metrics.all_conversions, campaign.start_date, campaign.status, ad_schedule_view.resource_name FROM ad_schedule_view WHERE campaign.id = 16922967818 AND segments.date BETWEEN '2022-04-01' AND '2022-04-26'"
            // const query = "SELECT ad_group.campaign, ad_group.id, ad_group.name, segments.date, metrics.average_cost, metrics.average_cpe, metrics.average_cpc, metrics.average_cpm, metrics.average_cpv, metrics.conversions, metrics.cost_micros, metrics.impressions, metrics.interactions, campaign.id, campaign.name, campaign.start_date, campaign.status FROM ad_group WHERE segments.date BETWEEN '2022-04-01' AND '2022-04-26' AND campaign.id = 16922967818"
            const query = "SELECT segments.date, segments.day_of_week, metrics.all_conversions, metrics.average_cost, metrics.average_cpc, metrics.average_cpe, metrics.average_cpm, metrics.average_cpv, metrics.conversions, metrics.cost_micros, metrics.interactions, metrics.impressions, metrics.value_per_conversion, campaign_budget.id, campaign_budget.amount_micros, campaign.id, campaign.name, campaign.start_date, campaign.status FROM campaign WHERE segments.date BETWEEN '2022-04-01' AND '2022-04-26' AND campaign.id = 16922967818"

            const customer = await super.getCustomer(req);
            const re = await customer.query(query);
            console.log('re', re)
            return re
        } catch (err) {
            console.log(err.message)
            throw err
        }
    }
}
