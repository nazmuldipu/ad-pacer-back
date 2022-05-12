import express from "express";
import config from "config";
import * as http from 'http';
import Logger from "./startup/logger";
// import routes from './startup/routes';
import {CommonRoutesConfig} from './common/common.routes.config';
import {UsersRoutes} from './users/users.routes.config';
import debug from 'debug';


const routes: Array<CommonRoutesConfig> = [];
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const HTTP_SERVER_PORT: number = config.get("HTTP_SERVER_PORT") || 5432;
const debugLog: debug.IDebugger = debug('app');

routes.push(new UsersRoutes(app));

require("./startup/logging")();

app.get("/", (req, res) => {
    console.log(req.body);
    res.send("Hello World!");
});

const servern = server.listen(HTTP_SERVER_PORT, () => {
    debugLog(`Server running at http://localhost:${HTTP_SERVER_PORT}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});

module.exports = servern;
