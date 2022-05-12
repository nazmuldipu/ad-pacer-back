"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("express-async-errors");
module.exports = function () {
    winston_1.default.exceptions.handle(new winston_1.default.transports.File({ filename: "uncaughtException.log" }));
    process.on("unhandledRejection", (ex) => {
        throw ex;
    });
    winston_1.default.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.splat(), winston_1.default.format.simple()),
    }));
    winston_1.default.add(new winston_1.default.transports.File({ filename: "logfile.log" }));
    winston_1.default.add(new winston_1.default.transports.File({ filename: "error.log", level: "error" }));
};
//# sourceMappingURL=logging.js.map