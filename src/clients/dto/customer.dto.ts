export interface Customer {
    customer_client: CustomerClient;
}

export interface CustomerClient {
    remoteClientId: number;
    client_customer: string;
    descriptive_name: string;
    currency_code: string;
    id: number;
    level: number;
    manager: boolean;
    time_zone: string;
    resource_name: string;
    loginCustomerId: string;
    teamEmails: string | string[];
}