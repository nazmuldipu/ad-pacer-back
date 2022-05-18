export interface AxiosConfig {
    headers: {
        Authorization: string;
        refresh_token: string | string[];
        "developer-token": string;
        "login-customer-id": any;
        "Content-Type": string;
    };
}
