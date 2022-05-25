export interface CampaignAccountingDto {
    id: number;
    campaignId: string;
    totalBudgetAmount: string;
    totalCostAmount: string;
    additionalCostAmount: string;
    budgetSavedAmount: string;
    totalCampaignRunDays: string;
    campaignPassedDays: string;
    campaignRemainingDays: string;
    loginCustomerId: string;
    createdByUserId: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
