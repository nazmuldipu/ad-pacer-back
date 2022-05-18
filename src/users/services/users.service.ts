import UsersDao from "../daos/users.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { UserDto } from "../dto/user.dto";

class UsersService implements CRUD {
	async create(resource: UserDto) {
		return UsersDao.addUser(resource);
	}

	async deleteById(resourceId: number) {
		return UsersDao.removeUserById(resourceId).toString();
	}

	async list(limit: number, page: number) {
		return UsersDao.getUsers();
	}

	async patchById(resource: UserDto) {
		return UsersDao.patchUserById(resource);
	}

	async readById(resourceId: number) {
		return UsersDao.getUserById(resourceId);
	}

	async updateById(resource: UserDto) {
		return UsersDao.putUserById(resource);
	}

	async getUserByEmail(email: string) {
		return UsersDao.getUserByEmail(email);
	}
}

export default new UsersService();
