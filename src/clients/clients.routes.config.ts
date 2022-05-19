import { CommonRoutesConfig } from "../common/common.routes.config";
import ClientController from "./controllers/clients.controller";
import ClientMiddleware from "./middleware/clients.middleware";
// import AdsApiBaseController from "../ads/controller/base.controller";
import express from "express";

export class ClientRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "ClientRoutes");
    }

    configureRoutes() {
        this.app
            .route("/ads-api/settings-clients")
            .get(ClientController.clietSettings)
            .post(
                ClientMiddleware.validateRequiredClientBodyFields,
                ClientController.createClietSettings
            );
        this.app
            .route("/user")
            .get(ClientController.listClient)
            .post(
                ClientMiddleware.validateRequiredClientBodyFields,
                ClientMiddleware.validateSameClientDoesntExist,
                ClientController.createClient
            );

        this.app.param("clientId", ClientMiddleware.extractClientId);
        this.app
            .route("/user/:clientId")
            .all(ClientMiddleware.validateClientExists)
            .get(ClientController.getClientById)
            .delete(ClientController.removeClient);

        this.app.put("/user/:userId", [
            ClientMiddleware.validateRequiredClientBodyFields,
            ClientMiddleware.validateSameRemoteClientIdBelongToSameClient,
            ClientController.put,
        ]);

        return this.app;
    }
}
