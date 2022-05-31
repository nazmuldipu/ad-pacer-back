import { CommonRoutesConfig } from "../common/common.routes.config";
import {UsersController} from "./controllers/users.controller";
const userCtrl = new UsersController();
import UsersMiddleware from "./middleware/users.middleware";
import express from "express";

export class UsersRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, "UsersRoutes");
	}

	configureRoutes() {
		this.app
			.route("/user")
			.get(userCtrl.listUsers)
			.post(
				UsersMiddleware.validateRequiredUserBodyFields,
				UsersMiddleware.validateSameEmailDoesntExist,
				userCtrl.createUser
			);

		this.app.param("userId", UsersMiddleware.extractUserId);
		this.app
			.route("/user/:userId")
			.all(UsersMiddleware.validateUserExists)
			.get(userCtrl.getUserById)
			.delete(userCtrl.removeUser);

		this.app.put("/user/:userId", [
			UsersMiddleware.validateRequiredUserBodyFields,
			UsersMiddleware.validateSameEmailBelongToSameUser,
			userCtrl.put,
		]);

		this.app.patch("/user/:userId", [
			UsersMiddleware.validatePatchEmail,
			userCtrl.patch,
		]);

		return this.app;
	}
}
