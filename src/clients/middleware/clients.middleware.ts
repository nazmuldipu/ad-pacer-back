import express from "express";
import clientService from "../services/clients.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:clients-controller");

class ClientMiddleware {
    async validateRequiredClientBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.remoteClientId && req.body.name && req.body.teamEmails.length) {
            next();
        } else {
            res.status(400).send({
                message: "Missing required fields name and email",
            });
        }
    }

    async validateSameClientDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const client = await clientService.getClientByRemoteClientId(req.body.remoteClientId);
        if (client) {
            res.status(400).send({
                message: `Client email already exists ${
                    !!client.deletedAt ? "but soft deleted" : ""
                }`,
            });
        } else {
            next();
        }
    }

    async validateSameRemoteClientIdBelongToSameClient(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const client = await clientService.getClientByRemoteClientId(req.body.remoteClientId);
        if (client && client.id === Number(req.params.clientId)) {
            next();
        } else {
            res.status(400).send({ message: "Invalid RemoteClientId" });
        }
    }


    async validateClientExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const client = await clientService.readById(Number(req.params.clientId));
        if (client) {
            next();
        } else {
            res.status(404).send({
                message: `Client ${req.params.clientId} not found`,
            });
        }
    }

    async extractClientId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.clientId;
        next();
    }
}

export default new ClientMiddleware();
