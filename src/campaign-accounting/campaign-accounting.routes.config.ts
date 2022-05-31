import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import CampaignAccountingController from "./controllers/campaign-accounting.controller";
const campaignAccountingCtrl = new CampaignAccountingController();
export class CampaignAccountingRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "CampaignAccountingRoutes");
    }

    configureRoutes() {
        // this.app.route("/campaign-accounting").get(campaignAccountingCtrl.clientSettings)
        // this.app.route("/campaign-accounting/:id").get(campaignAccountingCtrl.clientSettings)
        // this.app.route("/campaign-accounting/create").post(campaignAccountingCtrl.clientSettings)
        // this.app.route("/campaign-accounting/update").post(campaignAccountingCtrl.clientSettings)
        // this.app.route("/campaign-accounting/:id").delete(campaignAccountingCtrl.clientSettings)

        return this.app;
    }
}
