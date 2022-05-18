import express from "express";
import clientService from "../services/clients.service";
import AdsApiBaseController from "../../ads/controllers/base.controller";
// import argon2 from "argon2";
import debug from "debug";
import { ClientDto } from "../dto/client.dto";

const log: debug.IDebugger = debug("app:client-controller");
class ClientController {
    async clietSettings(req: express.Request, res: express.Response, next: express.NextFunction) {
        const {customers} = await AdsApiBaseController.getAllClients(req, res, next)
        let remoteData = customers;
        const localData = await clientService.list();
        if (remoteData && remoteData.length) {
            remoteData = remoteData.map((object) => {
                const rd = object.customer_client;
                rd.teamEmails = [];
                localData.forEach((item) => {
                //    const item = data.dataValues;
                   if (item.remoteClientId.toString() === rd.id.toString()) {
                      rd.teamEmails = JSON.parse(item.teamEmails);
                   }
                });
                return { ...rd, remoteClientId: rd.id };
             });
        }
        res.status(200).send("");
    }
    async listClient(req: express.Request, res: express.Response) {
        const client = await clientService.list();
        res.status(200).send(client);
    }

    async getClientById(req: express.Request, res: express.Response) {
        const client = await clientService.readById(Number(req.params.clientId));
        if (!client) {
            return res.status(404).send("not found");
        }
        res.status(200).send(client);
    }

    async createClient(req: express.Request, res: express.Response) {
        req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
        const clientId = await clientService.create(req.body);
        res.status(201).send({ id: clientId });
    }

    async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
        }
        log(await clientService.patchById(req.body));
        res.status(204).send("");
    }

    async put(req: express.Request, res: express.Response) {
        console.log("put");
        req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
        const clientObj: ClientDto = {
            id: req.params.clientId,
            ...req.body,
        };
        const resp: ClientDto = await clientService.updateById(clientObj);
        // log(resp);
        res.status(204).send(resp);
    }

    async removeClient(req: express.Request, res: express.Response) {
        log(await clientService.deleteById(Number(req.params.clientId)));
        res.status(204).send("");
    }
}

export default new ClientController();
