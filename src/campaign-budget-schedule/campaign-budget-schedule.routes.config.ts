import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import campaignBudgetScheduleCtrl from "./controllers/campaign-budget-schedule.controller";

export class CampaignBudgetScheduleRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "CampaignBudgetScheduleRoutes");
    }

    configureRoutes() {
        this.app.route("/campaign-budget-schedule").get(campaignBudgetScheduleCtrl.index)
        this.app.route("/campaign-budget-schedule/create").post(campaignBudgetScheduleCtrl.store)
        this.app.route("/campaign-budget-schedule/update").post(campaignBudgetScheduleCtrl.update)
        this.app.route("/campaign-budget-schedule/:id").delete(campaignBudgetScheduleCtrl.delete)
        return this.app;
    }
}
