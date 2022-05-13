"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const winston = __importStar(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("config"));
const debug_1 = __importDefault(require("debug"));
const users_routes_config_1 = require("./users/users.routes.config");
const app = (0, express_1.default)();
const server = http.createServer(app);
const HTTP_SERVER_PORT = config_1.default.get("HTTP_SERVER_PORT") || 5432;
const routes = [];
const debugLog = (0, debug_1.default)("app");
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true })),
};
if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, make terse
}
app.use(expressWinston.logger(loggerOptions));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
routes.push(new users_routes_config_1.UsersRoutes(app));
const runningMessage = `Server running at http://localhost:${HTTP_SERVER_PORT}`;
app.get("/", (req, res) => {
    res.status(200).send(runningMessage);
});
const servern = server.listen(HTTP_SERVER_PORT, () => {
    routes.forEach((route) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});
module.exports = servern;
//# sourceMappingURL=app.js.map