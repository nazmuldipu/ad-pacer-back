import { CommonRoutesConfig } from "../common/common.routes.config";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";
import express from "express";

export class UsersRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, "UsersRoutes");
	}

	configureRoutes() {
		this.app
			.route("/user")
			.get(UsersController.listUsers)
			.post(
				UsersMiddleware.validateRequiredUserBodyFields,
				UsersMiddleware.validateSameEmailDoesntExist,
				UsersController.createUser
			);

		this.app.param("userId", UsersMiddleware.extractUserId);
		this.app
			.route("/user/:userId")
			.all(UsersMiddleware.validateUserExists)
			.get(UsersController.getUserById)
			.delete(UsersController.removeUser);

		this.app.put("/user/:userId", [
			UsersMiddleware.validateRequiredUserBodyFields,
			UsersMiddleware.validateSameEmailBelongToSameUser,
			UsersController.put,
		]);

		this.app.patch("/user/:userId", [
			UsersMiddleware.validatePatchEmail,
			UsersController.patch,
		]);

		return this.app;
	}
}
