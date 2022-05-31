const axios = require("axios");
import express from "express";
import AdsApiBaseController from "./base.controller";
import { getCampaignCriteriaMutableURL } from "../../common/utils/googleAdsQuery";

export class AdsApiScheduleController extends AdsApiBaseController{
    /**
     * for the controller. Will be required to create
     * an instance of the controller
     */
    constructor() {
        super();
        this.getCriterion = this.getCriterion.bind(this)
        this.getCriterionByCampaignId = this.getCriterionByCampaignId.bind(this)
        this.deleteCampaignSchedule = this.deleteCampaignSchedule.bind(this)
        this.saveSchedule = this.saveSchedule.bind(this)
    }

    /**
     * @param req
     * @param res
     * @param next
     * @returns response of campaign schedule by API route call
     */
    async getCriterion(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const query = "SELECT campaign_criterion.ad_schedule.end_hour, campaign_criterion.ad_schedule.end_minute, campaign_criterion.ad_schedule.start_hour, campaign_criterion.ad_schedule.start_minute, campaign_criterion.ad_schedule.day_of_week FROM campaign_criterion WHERE campaign.id = 16530339838";
            const customer = await super.getCustomer(req, res, next);
            const result = await customer.query(query);
            res.json(result);
        } catch (err) {
            next(err);
        }
    };

    /**
     * @param req
     * @param next
     * @param campaignId
     * @returns response of campaign schedule by internal method call
     */
    async getCriterionByCampaignId(
        req: express.Request,
        next: express.NextFunction,
        campaignId
    ) {
        console.log('campaignId',campaignId)
        try {
            const query = `SELECT campaign_criterion.criterion_id, campaign_criterion.ad_schedule.end_hour, campaign_criterion.ad_schedule.end_minute, campaign_criterion.ad_schedule.start_hour, campaign_criterion.ad_schedule.start_minute, campaign_criterion.ad_schedule.day_of_week FROM campaign_criterion WHERE campaign.id = ${campaignId}`;
            const customer = await super.getCustomer(req, next);
            return await customer.query(query);
        } catch (err) {
            throw err;
        }
    };

    /**
     * @param req
     * @param res
     * @param next
     * @returns remove campaign schedule by internal method call
     */
    async deleteCampaignSchedule(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const customerId = req.body.customerId;
        const URL = getCampaignCriteriaMutableURL(customerId);
        const { campaignCriteriaIds } = req.body;
        if (!campaignCriteriaIds) {
            throw {message: "Campaign schedule resource not found!", status: 404}
        }

        const config = await super.getAxiosConfig(req, res, next);
        const removeObject = (campaignCriteriaId) => {
            return {
                remove: `customers/${customerId}/campaignCriteria/${campaignCriteriaId}`,
            };
        };

        try {
            const data = {
                operations: [],
            };
            for (let index = 0; index < campaignCriteriaIds.length; index++) {
                const id = campaignCriteriaIds[index];
                const obj = JSON.parse(JSON.stringify(removeObject(id)));
                data.operations.push(obj);
            }
            const result = await axios.post(URL, data, config);
            res.json({
                success: true,
            });
        } catch (err) {
            throw err;
        }
    };

    /**
     * @param req
     * @param res
     * @param next
     * delete schedules, if there are any campaign criteria id provide in array format
     * create campaign schedule
     * @returns campaign schedule by API route call
     */
    async saveSchedule(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const customerId = req.body.customerId;
        const campaignId = req.body.campaignId;
        const days = req.body.days;

        const URL = getCampaignCriteriaMutableURL(customerId);
        const config = await super.getAxiosConfig(req, res, next);
        try {
            if (Array.isArray(req.body?.campaignCriteriaIds)) {
                await this.deleteCampaignSchedule(req, res, next);
            }

            const createObject = {
                create: {
                    campaign: `customers/${customerId}/campaigns/${campaignId}`,
                    adSchedule: {
                        endHour: req.body.endHour,
                        endMinute: req.body.endMinute,
                        startHour: req.body.startHour,
                        startMinute: req.body.startMinute,
                        dayOfWeek: "",
                    },
                },
            };

            const data = {
                operations: [],
            };

            for (let index = 0; index < days.length; index++) {
                const item = days[index];
                const obj = JSON.parse(JSON.stringify(createObject));
                obj.create.adSchedule.dayOfWeek = item;
                data.operations.push(obj);
            }
            return await axios.post(URL, data, config);
        } catch (err) {
            throw err;
        }
    };
}
