import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
// import ClientController from "../clients/controllers/clients.controller";
const AdsApiBaseController = require("./controllers/base.controller");
const adsApiBaseCtrl = new AdsApiBaseController();
const UserController = require('../users/controllers/users.controller');
const AdsApiCampaignController = require('./controllers/campaign.controller');
const adsApiCampaignCtrl = new AdsApiCampaignController();
const AdsApiCustomerController = require('./controllers/customer.controller');
const adsApiCustomerCtrl = new AdsApiCustomerController();
const AdsApiScheduleController = require('./controllers/schedule.controller');
const adsApiScheduleCtrl = new AdsApiScheduleController();

export class AdsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "AdsRoutes");
    }

    configureRoutes() {
        // this.app.route("/ads-api/oauth2/login").post(userCtrl.oAuthLogin);
        this.app.route("/ads-api/clients").get(adsApiBaseCtrl.getAllClients);
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
