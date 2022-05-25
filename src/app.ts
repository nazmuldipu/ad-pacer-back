import express from "express";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import config from "config";
import debug from "debug";
import * as dotenv from "dotenv";

dotenv.config();


import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";
import { ClientRoutes } from "./clients/clients.routes.config";
import { AdsRoutes } from "./ads/ads.routes.config";
import dbInit from './db/init'
import ValidateAuthRoute from './common/auth.routes.config';

dbInit();
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const HTTP_SERVER_PORT: number = config.get("HTTP_SERVER_PORT") || 5432;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

const loggerOptions: expressWinston.LoggerOptions = {
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.json(),
		winston.format.prettyPrint(),
		winston.format.colorize({ all: true })
	),
};

if (!process.env.DEBUG) {
	loggerOptions.meta = false; // when not debugging, make terse
}
app.use(expressWinston.logger(loggerOptions));
app.use(express.json());
app.use(cors());
app.use(ValidateAuthRoute);

routes.push(new UsersRoutes(app));
routes.push(new ClientRoutes(app));
routes.push(new AdsRoutes(app));

const runningMessage = `Server running at http://localhost:${HTTP_SERVER_PORT}`;

app.get("/", (req: express.Request, res: express.Response) => {
	res.status(200).send(runningMessage);
});

const servern = server.listen(HTTP_SERVER_PORT, () => {
	routes.forEach((route: CommonRoutesConfig) => {
		debugLog(`Routes configured for ${route.getName()}`);
	});
	
	console.log(runningMessage);
});

console.log('process.env.ALLOWED_EMAIL_SUFFIX', process.env.ALLOWED_EMAIL_SUFFIX)

module.exports = servern;
