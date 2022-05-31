import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import {UsersController} from "../users/controllers/users.controller";
const usersCtrl = new UsersController();
import {AdsApiCampaignController} from './controllers/campaign.controller';
const adsApiCampaignCtrl = new AdsApiCampaignController();
import {AdsApiCustomerController} from './controllers/customer.controller';
const adsApiCustomerCtrl = new AdsApiCustomerController();
import {AdsApiScheduleController} from './controllers/schedule.controller';
const adsApiScheduleCtrl = new AdsApiScheduleController();

export class AdsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "AdsRoutes");
    }

    configureRoutes() {
        this.app.route("/ads-api/oauth2/login").post(usersCtrl.oAuthLogin);
        this.app.route("/ads-api/clients").get(adsApiCustomerCtrl.getAllClients);
        this.app.route("/ads-api/campaigns").get(adsApiCampaignCtrl.getAllCampaigns);
        this.app.route("/ads-api/get-criterion").get(adsApiScheduleCtrl.getCriterion);
        this.app.route("/ads-api/save-schedule").post(adsApiScheduleCtrl.saveSchedule);
        this.app.route("/ads-api/campaign/logs").get(adsApiCampaignCtrl.getCampaignLogs);
        this.app.route("/ads-api/client/campaigns").get(adsApiCampaignCtrl.getClientCampaigns);
        this.app.route("/ads-api/update/campaign-start-date").post(adsApiCampaignCtrl.updateCampaignStartDate);
        this.app.route("/ads-api/update/campaign-end-date").post(adsApiCampaignCtrl.updateCampaignEndDate);
        this.app.route("/ads-api/update/campaign-status/:campaignId").put(adsApiCampaignCtrl.updateCampaignStatus);
        this.app.route("/ads-api/delete/campaign-budget").post(adsApiScheduleCtrl.deleteCampaignSchedule);
        this.app.route("/ads-api/accessible-customers").get(adsApiCustomerCtrl.getAccessibleCustomers);
        this.app.route("/ads-api/campaign-ad-group-segment-cost").post(adsApiCampaignCtrl.getAdGroupMetricsByDate);
        this.app.route("/ads-api/get-access-token").get(adsApiCampaignCtrl.getAccessToken);

        return this.app;
    }
}
