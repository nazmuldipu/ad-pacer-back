import express from "express";
import clientService from "../services/clients.service";
const AdsApiBaseController = require("../../ads/controllers/base.controller")
const adsApiBaseCtrl = new AdsApiBaseController();
import debug from "debug";
import { ClientDto } from "../dto/client.dto";
import { Customer, CustomerClient } from "../dto/customer.dto";
import { filterUpdateAbleModelKeys } from "../../common/utils/utils";
import { Client } from "../models";

const log: debug.IDebugger = debug("app:client-controller");

export class ClientController {
    async clientSettings(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const { customers }: { customers: Customer[] } =
                await adsApiBaseCtrl.getAllClients(req, res, next);

            let remoteData = customers;
            let responseData: CustomerClient[] = [];
            const localData: ClientDto[] = await clientService.list();
            if (remoteData && remoteData.length) {
                responseData = remoteData.map((object: Customer) => {
                    const rd:CustomerClient = object.customer_client;
                    rd.teamEmails = [];
                    localData.forEach((item) => {
                        //    const item = data.dataValues;
                        if (
                            item.remoteClientId.toString() === rd.id.toString()
                        ) {
                            rd.teamEmails = [...item.teamEmails];
                        }
                    });
                    return { ...rd, remoteClientId: rd.id };
                });
            }
            res.status(200).send(responseData);
        } catch (error) {
            res.status(500).json("Server Error");
        }
    }

    async createClientSettings(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const remoteClientId = req.body.remoteClientId;
            let item = await clientService.getClientByRemoteClientId(
                remoteClientId
            );

            if (item) {
                // item = filterUpdateAbleModelKeys(item, {}, req);
                let Obj: ClientDto = filterUpdateAbleModelKeys(item, {}, req) as ClientDto; //filterUpdateAbleModelKeys(item, req) as ClientDto;
                item["remoteClientId"] = Obj['remoteClientId'];
                item["teamEmails"] = Obj['teamEmails'];
                item["updatedByUserId"] = req["authUser"] ? req["authUser"]["id"] : null;
                res.status(200).json(await item.save());
            } else {
                const modelObj: Client = new Client(req.body);
                modelObj["createdByUserId"] = req["authUser"] ? req["authUser"]["id"] : null;
                await modelObj.save();
                res.status(201).json(modelObj);
            }
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    async listClient(req: express.Request, res: express.Response) {
        const client = await clientService.list();
        res.status(200).send(client);
    }

    async getClientById(req: express.Request, res: express.Response) {
        const client = await clientService.readById(
            Number(req.params.clientId)
        );
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
