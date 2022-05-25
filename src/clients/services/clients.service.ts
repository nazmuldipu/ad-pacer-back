import ClientsDao from "../daos/clients.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { ClientDto } from "../dto/client.dto";

class ClientsService implements CRUD {
	async create(resource: ClientDto) {
		return ClientsDao.addClient(resource);
	}

	async deleteById(resourceId: number) {
		return ClientsDao.removeClientById(resourceId).toString();
	}

	async list() {
		return ClientsDao.getClients();
	}

	async patchById(resource: ClientDto) {
        return null;
	}

	async readById(resourceId: number) {
		return ClientsDao.getClientById(resourceId);
	}

	async updateById(resource: ClientDto) {
		return ClientsDao.putClientById(resource);
	}

	async getClientByName(name: string) {
		return ClientsDao.getClientByName(name);
	}

	async getClientByRemoteClientId(remoteClientId: string) {
		return ClientsDao.getClientByRemoteClientId(remoteClientId);
	}
}

export default new ClientsService();
