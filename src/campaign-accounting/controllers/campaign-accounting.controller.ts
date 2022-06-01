import debug from "debug";
import {CampaignAccounting} from "../models";

const log: debug.IDebugger = debug("app:campaign-accounting-controller");

export default class CampaignAccountingController {
    constructor() {
        this.findOneByCampaignId = this.findOneByCampaignId.bind(this);
    }

    /**
     * @param campaignId The request object
     * @return {Object} res The response object
     */
    async findOneByCampaignId(campaignId) {
        try {
            return await CampaignAccounting.findOne({ where: { campaignId: campaignId } })
        } catch (err) {
            console.log(err.message)
        }
    }

    async saveData(data) {
        const modelObj = new CampaignAccounting(data)

        try {
            await modelObj.save()
        } catch (err) {
            console.log(err.message)
        }
    }
}
