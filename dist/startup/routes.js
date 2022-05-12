"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
function Routes(app) {
    // USER ROUTES
    app.get("/users", user_controller_1.getUserHandler);
}
exports.default = Routes;
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
//# sourceMappingURL=routes.js.map