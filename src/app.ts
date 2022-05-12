import express from "express";
import config from "config";
import Logger from "./startup/logger";
import routes from './startup/routes';

const app = express();
const HTTP_SERVER_PORT: number = config.get("HTTP_SERVER_PORT") || 5432;

require("./startup/logging")();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const server = app.listen(HTTP_SERVER_PORT, () => {
    Logger.debug(`Listening on http://localhost:${HTTP_SERVER_PORT} ...`);
    routes(app);
});

module.exports = server;
