import { Express } from "express";
import {getUserHandler} from "../controllers/user.controller";

export default function Routes(app: Express) {
    // USER ROUTES
    app.get("/users", getUserHandler);
}


/*
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");

const {
  getItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  loginCredentials,
  validateEmailIsUnique,
  validateEmailHasSubstring
} = require("../validations/user.validation");

const UserController = require('../controllers/user.controller');
const userCtrl = new UserController();

router
    .get("/user", validate(getItems), userCtrl.index)
    .post("/user", validate(createItem), validateEmailHasSubstring, validateEmailIsUnique, userCtrl.store)
    .get("/user/:id", validate(getItem), userCtrl.show)
    .patch("/user/:id", validate(updateItem), validateEmailHasSubstring, userCtrl.update)
    .delete("/user/:id", validate(deleteItem), userCtrl.delete)
    .post("/user/login", validate(loginCredentials), validateEmailHasSubstring, userCtrl.login)
    .post("/user/registration", validate(createItem), validateEmailHasSubstring, validateEmailIsUnique, userCtrl.store);

module.exports = router
*/ 