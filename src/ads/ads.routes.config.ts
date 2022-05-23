import { CommonRoutesConfig } from "../common/common.routes.config";
import ClientController from "../clients/controllers/clients.controller";
import ClientMiddleware from "../clients/middleware/clients.middleware";
// import AdsApiBaseController from "../ads/controller/base.controller";
import express from "express";

export class AdsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "AdsRoutes");
    }

    configureRoutes() {
        this.app
            .route("/ads-api/settings-clients")
            .get(ClientController.clietSettings)
            .post(
                ClientMiddleware.validateRequiredClientBodyFields,
                ClientController.createClietSettings
            );
        return this.app;
    }
}
