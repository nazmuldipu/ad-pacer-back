import { CommonRoutesConfig } from "../common/common.routes.config";
import ClientController from "./controllers/clients.controller";
// import AdsApiBaseController from "../ads/controller/base.controller";
import express from "express";

export class ClientRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "ClientRoutes");
    }

    configureRoutes() {
        this.app
            .route("/ads-api/oauth2/login")
            .post(ClientController.oAuthClient);

        return this.app;
    }
}
