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
const users_service_1 = __importDefault(require("../services/users.service"));
// import argon2 from "argon2";
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)("app:users-controller");
class UsersController {
    listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield users_service_1.default.list(100, 0);
            res.status(200).send(users);
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.readById(req.params.userId);
            res.status(200).send(user);
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('abc', req);
            req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
            const userId = yield users_service_1.default.create(req.body);
            res.status(201).send({ id: userId });
        });
    }
    patch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.password) {
                req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
            }
            log(yield users_service_1.default.patchById(req.body));
            res.status(204).send(``);
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
            log(yield users_service_1.default.updateById(Object.assign({ id: req.params.userId }, req.body)));
            res.status(204).send(``);
        });
    }
    removeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            log(yield users_service_1.default.deleteById(req.params.userId));
            res.status(204).send(``);
        });
    }
}
exports.default = new UsersController();
//# sourceMappingURL=users.controller.js.map