import { ClientDto } from "../dto/client.dto";
import { Client } from "../models"
import { ClientInput, ClientOutput } from "../models/Client";

import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class ClientsDao {

    constructor() {
        log("Created new instance of ClientDto");
    }

    async addClient(client: ClientInput): Promise<ClientOutput> {
        // client.id = shortid.generate();
        // this.clients.push(client);
        const [newClient] = await Client.findOrCreate({
            where: {
                name: client.name,
            },
            defaults: client,
        });
        return newClient;
    }

    async getClients(): Promise<ClientOutput[]> {
        return Client.findAll();
    }

    async getClientById(clientId: number): Promise<ClientOutput> {
        const client = await Client.findByPk(clientId);

        return client;
    }

    async putClientById(client: ClientDto): Promise<ClientOutput> {
        const currentClient = await Client.findByPk(client.id);

        const updatedClient = await currentClient.update(client);
        return updatedClient;
    }

    async removeClientById(clientId: number) {
        const deletedClientCount = await Client.destroy({
            where: { id: clientId },
        });

        return !!deletedClientCount;
    }

    async getClientByName(name: string) {
        const clientWithEmail = await Client.findOne({
            where: {
                name
            },
            paranoid: false 
        });
        if (clientWithEmail) {
            return clientWithEmail;
        } else {
            return null;
        }
    }

    async getClientByRemoteClientId(remoteClientId: string) {
        const clientWithRemoteClientId = await Client.findOne({
            where: {
                remoteClientId
            },
            paranoid: false 
        });
        if (clientWithRemoteClientId) {
            return clientWithRemoteClientId;
        } else {
            return null;
        }
    }
}

export default new ClientsDao();
