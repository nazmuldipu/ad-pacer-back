import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import CampaignAccountingController from "./controllers/campaign-accounting.controller";

export class CampaignAccountingRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "CampaignAccountingRoutes");
    }

    configureRoutes() {
        // this.app.route("/campaign-accounting").get(CampaignAccountingController.clientSettings)
        // this.app.route("/campaign-accounting/:id").get(CampaignAccountingController.clientSettings)
        // this.app.route("/campaign-accounting/create").post(CampaignAccountingController.clientSettings)
        // this.app.route("/campaign-accounting/update").post(CampaignAccountingController.clientSettings)
        // this.app.route("/campaign-accounting/:id").delete(CampaignAccountingController.clientSettings)

        return this.app;
    }
}
