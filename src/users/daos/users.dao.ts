import { UserDto } from "../dto/user.dto";
import { Op } from "sequelize";
import { User } from "../models";
import { UserInput, UserOutput } from "../models/User";
import { GetAllUsersFilters } from "./types";
import { isEmpty } from "lodash";

import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
    users: Array<UserDto> = [];

    constructor() {
        log("Created new instance of UsersDao");
    }

    async addUser(user: UserInput): Promise<UserOutput> {
        // user.id = shortid.generate();
        // this.users.push(user);
        const [newUser] = await User.findOrCreate({
            where: {
                email: user.email,
            },
            defaults: user,
        });
        return newUser;
    }

    async getUsers(filters?: GetAllUsersFilters): Promise<UserOutput[]> {
        return User.findAll({
            where: {
                ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
            },
            ...((filters?.isDeleted || filters?.includeDeleted) && {
                paranoid: true,
            }),
        });
    }

    async getUserById(userId: number): Promise<UserOutput> {
        const ingredient = await User.findByPk(userId);

        if (!ingredient) {
            // @todo throw custom error
            throw new Error("not found");
        }

        return ingredient;
    }

    async putUserById(user: UserDto) {
        const currentUser = await User.findByPk(user.id);

        if (!currentUser) {
            // @todo throw custom error
            throw new Error("not found");
        }

        const updatedUser = await currentUser.update(user);
        return updatedUser;
    }

    async patchUserById(user: UserDto) {
        const objIndex = this.users.findIndex(
            (obj: { id: number }) => obj.id === user.id
        );
        const currentUser = this.users[objIndex];
        const allowedPatchFields = [
            "password",
            "firstName",
            "lastName",
            "permissionLevel",
        ];
        for (const field of allowedPatchFields) {
            if (field in user) {
                currentUser[field] = user[field];
            }
        }
        this.users.splice(objIndex, 1, currentUser);
        return `${user.id} patched`;
    }

    async removeUserById(userId: number) {
        const deletedUserCount = await User.destroy({
            where: { id: userId },
        });

        return !!deletedUserCount;
    }

    async getUserByEmail(email: string) {
        const userWithEmail = await User.findOne({
            where: {
                email,
            },
        });
        if (userWithEmail) {
            return userWithEmail;
        } else {
            return null;
        }
    }
}

export default new UsersDao();
