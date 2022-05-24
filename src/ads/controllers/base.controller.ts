import axios from "axios";
import express from "express";
import { Oath2Params, AxiosConfig } from "../dto";
import { getAccessTokenGettableURL } from "../../common/utils/googleAdsQuery";
import { GoogleAdsApi } from "google-ads-api";
import type { Customer } from "../../clients/dto/customer.dto";

class AdsApiBaseController {
    /**
     *
     * @returns get Oath 2 params
     *
     */
    getOath2Params(): Oath2Params {
        return {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            developer_token: process.env.DEVELOPER_TOKEN,
            refresh_token: "",
            grant_type: "",
        };
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns get axios config
     *
     */
    getAxiosConfig(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): AxiosConfig {
        return {
            headers: {
                Authorization: `Bearer ${req.headers["access-token"]}`,
                refresh_token: req.headers["refresh-token"],
                "developer-token": process.env.DEVELOPER_TOKEN,
                "login-customer-id": req.body.loginCustomerId,
                "Content-Type": "application/json",
            },
        };
    }

    /**
     *
     * @param refreshToken
     * @returns access token by API route call
     *
     */
    async getAccessToken(refreshToken: string) {
        try {
            const obj = { ...this.getOath2Params() };
            obj.refresh_token = refreshToken; //req.query["refresh-token"]
            obj.grant_type = "refresh_token";
            delete obj.developer_token;
            const URL = getAccessTokenGettableURL();
            const result = await axios.post(URL, obj);
            return result.data;
        } catch (err) {
            throw err;
        }
    }

    /**
     *
     * @param req
     * @returns get accessible customer from ads api
     *
     */
    async getCustomer(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const client: GoogleAdsApi = new GoogleAdsApi(this.getOath2Params());
        let customerId: string = null;
        let loginCustomerId: string = null;

        if (req.body?.customerId) {
            customerId = req.body.customerId;
        } else {
            customerId = req.query.customerId.toString();
        }

        if (req.body?.loginCustomerId) {
            loginCustomerId = req.body.loginCustomerId;
        } else {
            loginCustomerId = req.query.loginCustomerId.toString();
        }

        return client.Customer({
            customer_id: customerId,
            login_customer_id: loginCustomerId,
            refresh_token: req.headers["refresh-token"].toString(),
        });
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns get accessible customers from ads api
     *
     */
    async getAccessibleCustomers(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const accessToken: string = req.headers["access-token"].toString();
        const URL =
            "https://googleads.googleapis.com/v10/customers:listAccessibleCustomers";
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "developer-token": process.env.DEVELOPER_TOKEN,
                "Content-Type": "application/json",
            },
        };
        try {
            const { data }: { data: { resourceNames: string[] } } =
                await axios.get(URL, config);
            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns getAllClients by API route call
     *
     */
    async getAllClients(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            let { resourceNames }: { resourceNames: string[] } =
                await this.getAccessibleCustomers(req, res, next);

            const query =
                "SELECT customer_client.client_customer, customer_client.descriptive_name, customer_client.currency_code, customer_client.id, customer_client.level, customer_client.manager, customer_client.time_zone FROM customer_client WHERE customer_client.manager = FALSE";

            resourceNames =
                resourceNames &&
                resourceNames.length &&
                resourceNames.map((str: string) => {
                    return str.replace(/['customers/' ]+/g, " ").trim();
                });
            
            
            let customers = [];
            let customerId = null;
            let clientCustomersIds = [];
            for (let i = 0; i < resourceNames.length; i++) {
                req.query.customerId =
                    req.query.loginCustomerId =
                    customerId =
                        resourceNames[i];
                try {
                    const customer = await this.getCustomer(req, res, next);
                    const newCustomers: Customer[] = await customer.query(query);
                    if (newCustomers && newCustomers.length) {
                        let filteredCustomers = [];
                        newCustomers.forEach((el) => {
                            if (
                                !clientCustomersIds.includes(
                                    el.customer_client.client_customer
                                )
                            ) {
                                clientCustomersIds.push(
                                    el.customer_client.client_customer
                                );
                                filteredCustomers.push(el);
                            }
                        });

                        filteredCustomers.map((acc) => {
                            const obj = acc;
                            obj["customer_client"]["loginCustomerId"] =
                                resourceNames[i];
                            return obj;
                        });

                        customers = customers.concat(filteredCustomers);
                    }
                } catch (error) {
                    continue;
                }
            }
            return { customers, customerId };
        } catch (error) {
            next(error);
        }
    }
}

export default new AdsApiBaseController();
