import * as dotenv from "dotenv";
dotenv.config();
import CampaignBudgetScheduleController from "../campaign-budget-schedule/controllers/campaign-budget-schedule.controller"
const campaignBudgetScheduleCtrl = new CampaignBudgetScheduleController();

(async () => {
    await campaignBudgetScheduleCtrl.fireDailyCampaignBudgetScheduleEventJob()
})().catch(err => {
    console.error(err);
});
