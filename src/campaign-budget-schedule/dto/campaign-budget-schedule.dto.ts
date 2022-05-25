export interface CampaignBudgetScheduleDto {
    id: number;
    campaignId: string;
    budgetId: string;
    runDate: string;
    dayOfTheWeek: string;
    endHour: string;
    endMinute: string;
    startMinute: string;
    startHour: string;
    amount: string;
    customerId: string;
    loginCustomerId: string;
    customerTimezone: string;
    createdByUserId: number;
    status: string;
    dateExecuted: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
