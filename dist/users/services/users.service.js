"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_dao_1 = __importDefault(require("../daos/users.dao"));
class UsersService {
    create(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.addUser(resource);
        });
    }
    deleteById(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.removeUserById(resourceId);
        });
    }
    list(limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('limit', limit, 'page', page);
            return users_dao_1.default.getUsers();
        });
    }
    patchById(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.patchUserById(resource);
        });
    }
    readById(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.getUserById(resourceId);
        });
    }
    updateById(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.putUserById(resource);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.getUserByEmail(email);
        });
    }
}
exports.default = new UsersService();
//# sourceMappingURL=users.service.js.map