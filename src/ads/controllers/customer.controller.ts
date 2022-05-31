import express from "express";
import {AdsApiBaseController} from "./base.controller";

export class AdsApiCustomerController extends AdsApiBaseController{
    /**
     * for the controller. Will be required to create
     * an instance of the controller
     */
    constructor() {
        super();
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns get accessible customer from ads api
     *
     */
    async getCustomer(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        return super.getCustomer(req, res, next)
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
        return super.getAccessibleCustomers(req, res, next)
    };

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
    )  {
        const data = await super.getAllClients(req, res, next)
        console.log('data', data)
        res.json(data);
    };
}
