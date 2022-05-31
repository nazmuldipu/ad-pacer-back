import  express from "express";
import AdsApiBaseController from "./base.controller";

export default class AdsApiCustomerController extends AdsApiBaseController{
    /**
     * for the controller. Will be required to create
     * an instance of the controller
     */
    constructor() {
        super();
        this.getCustomerAllClients = this.getCustomerAllClients.bind(this)
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
    async getCustomerAllClients(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    )  {
        const data = await super.getAllClients(req, res, next)
        res.json(data);
    };
}
