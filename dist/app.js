"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./startup/logger"));
const routes_1 = __importDefault(require("./startup/routes"));
const app = (0, express_1.default)();
const HTTP_SERVER_PORT = config_1.default.get("HTTP_SERVER_PORT") || 5432;
require("./startup/logging")();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const server = app.listen(HTTP_SERVER_PORT, () => {
    logger_1.default.debug(`Listening on http://localhost:${HTTP_SERVER_PORT} ...`);
    (0, routes_1.default)(app);
});
module.exports = server;
//# sourceMappingURL=app.js.map