import winston from "winston";
require("express-async-errors");

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.File({ filename: "uncaughtException.log" })
    );

    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    winston.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.simple()
            ),
        })
    );
    winston.add(new winston.transports.File({ filename: "logfile.log" }));
    winston.add(new winston.transports.File({ filename: "error.log", level: "error" }));
};
