export const getAccessTokenGettableURL = (): string => {
    return `https://www.googleapis.com/oauth2/v4/token`;
};

export const getCampaignMutableURL = (customerId, version = 'v10') => {
    return `https://googleads.googleapis.com/${version}/customers/${customerId}/campaigns:mutate`
}

export const getCampaignCriteriaMutableURL = (customerId, version = 'v10') => {
    return `https://googleads.googleapis.com/${version}/customers/${customerId}/campaignCriteria:mutate`
}

export const getBudgetMutableURL = (customerId, version = 'v10') => {
    return `https://googleads.googleapis.com/${version}/customers/${customerId}/campaignBudgets:mutate`
}
