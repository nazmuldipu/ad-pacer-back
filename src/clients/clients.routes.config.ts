import { CommonRoutesConfig } from "../common/common.routes.config";
import ClientController from "./controllers/clients.controller";
import ClientMiddleware from "./middleware/clients.middleware";
import AdsApiBaseController from "../ads/controllers/base.controller";
import express from "express";

export class ClientRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "ClientRoutes");
    }

    configureRoutes() {
        this.app
            .route("/ads-api/oauth2/login")
            .post(ClientController.oAuthClient);
        this.app
            .route("/ads-api/settings-clients")
            .get(ClientController.clietSettings)
            // .post(
            //     ClientMiddleware.validateRequiredClientBodyFields,
            //     ClientController.createClietSettings
            // );
        this.app
            .route("/ads-api/clients")
            .get(ClientController.getClientList);
        return this.app;
    }
}
