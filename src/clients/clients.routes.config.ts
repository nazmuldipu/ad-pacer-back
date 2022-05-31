import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import ClientController from "./controllers/clients.controller";
const clientCtrl = new ClientController();
import ClientMiddleware from "./middleware/clients.middleware";

export class ClientRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "ClientRoutes");
    }

    configureRoutes() {
        this.app
            .route("/ads-api/settings-clients")
            .get(clientCtrl.clientSettings)
            .post(
                ClientMiddleware.validateRequiredClientBodyFields,
                clientCtrl.createClientSettings
            );
        return this.app;
    }
}
