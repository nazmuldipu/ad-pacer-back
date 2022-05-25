import { CommonRoutesConfig } from "../common/common.routes.config";
import ClientController from "./controllers/clients.controller";
import ClientMiddleware from "./middleware/clients.middleware";
import express from "express";

export class ClientRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "ClientRoutes");
    }

    configureRoutes() {
        this.app
            .route("/ads-api/settings-clients")
            .get(ClientController.clientSettings)
            .post(
                ClientMiddleware.validateRequiredClientBodyFields,
                ClientController.createClientSettings
            );
        return this.app;
    }
}
