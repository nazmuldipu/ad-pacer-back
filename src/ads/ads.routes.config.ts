import { CommonRoutesConfig } from "../common/common.routes.config";
// import ClientController from "../clients/controllers/clients.controller";
import ClientMiddleware from "../clients/middleware/clients.middleware";
import AdsApiBaseController from "./controllers/base.controller";
import express from "express";

export class AdsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "AdsRoutes");
    }

    configureRoutes() {
        console.log('configureRoutes');
        console.log(AdsApiBaseController);
        this.app
            .route("/ads-api/clients")
            .get(AdsApiBaseController.getAllClients);

        return this.app;
    }
}
