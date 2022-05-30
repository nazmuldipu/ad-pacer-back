import { User } from "../users/models";
import { Client } from "../clients/models";
import { CampaignBudgetSchedule } from "../campaign-budget-schedule/models";
import { CampaignAccounting } from "../campaign-accounting/models";

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV !== "test";

const dbInit = () => {
    User.sync({ alter: isDev || isTest });
    Client.sync({ alter: isDev || isTest });
    CampaignBudgetSchedule.sync({ alter: isDev || isTest });
    CampaignAccounting.sync({ alter: isDev || isTest });
};

export default dbInit;
