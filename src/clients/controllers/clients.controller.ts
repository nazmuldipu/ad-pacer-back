import express from "express";
import clientService from "../services/clients.service";
import AdsApiBaseController from "../../ads/controllers/base.controller";
import axios from "axios";
import UsersMiddleware from "../../users/middleware/users.middleware";
import usersService from "../../users/services/users.service";

// import argon2 from "argon2";
import debug from "debug";
import { ClientDto } from "../dto/client.dto";
import { Customer, CustomerClient } from "../dto/customer.dto";
import { filterUpdateAbleModelKeys } from "../../common/utils/utils";
import { google } from "googleapis";
import { Client } from "../models";
import { UserDto } from "../../users/dto/user.dto";
import UsersController from "../../users/controllers/users.controller";

const log: debug.IDebugger = debug("app:client-controller");

const getRedirectURL = ({ hostname }) => {
    return process.env.REDIRECT_URL;
    // return 'http://localhost:3000'
};
const decodeAuthCredentials = async (token) => {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`;
    const result = await axios.get(url);
    return result.data;
};

class ClientController {
    async oAuthClient(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const oauth2client = new google.auth.OAuth2(
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                getRedirectURL(req)
            );
            const { tokens } = await oauth2client.getToken(req.body.code);
            const user = await decodeAuthCredentials(tokens.access_token);
            const isValidEmail = await UsersMiddleware.validateEmail(
                user.email
            );

            req.body.email = user.email;
            req.body.refreshToken = tokens.refresh_token;

            if (!isValidEmail) {
                req.body.name = user.name;
                const modelObj = await usersService.create(req.body);
            }
            const { accessToken, userObj } = await UsersController.login(
                req,
                res,
                next
            );
            user.accessToken = accessToken;
            user.refreshToken = userObj.refreshToken;
            user.loginUserId = userObj.id;

            res.json({ ...tokens, user });
        } catch (err) {
            next(err);
        }
    }

    async clietSettings(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const { customers }: { customers: Customer[] } =
                await AdsApiBaseController.getAllClients(req, res, next);

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
    async createClietSettings(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const remoteClientId = req.body.remoteClientId;
            const item = await clientService.getClientByRemoteClientId(
                remoteClientId
            );

            if (item) {
                let Obj: ClientDto = {} as ClientDto; //filterUpdateAbleModelKeys(item, req) as ClientDto;
                Obj["updatedByUserId"] = req["authUser"]["id"];
                res.status(200).json(await item.save());
            } else {
                const modelObj: Client = new Client(req.body);
                modelObj["createdByUserId"] = req["authUser"]["id"];
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

export default new ClientController();
