import express from "express";
import userService from "../services/users.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:users-controller");
const isEmail = (email: string): boolean => {
    let regexp = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(email);
};
const ALLOWED_EMAIL_SUFFIX = process.env.ALLOWED_EMAIL_SUFFIX.split(',');
const loginError = { status: 422, message: process.env.LOGIN_ERROR_MESSAGE }

class UsersMiddleware {
    async validateRequiredUserBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.email && req.body.name) {
            if (!isEmail(req.body.email)) {
                return res.status(400).send({
                    message: "Invalid email",
                });
            }
            next();
        } else {
            res.status(400).send({
                message: "Missing required fields name and email",
            });
        }
    }

    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({
                message: `User email already exists ${
                    !!user.deletedAt ? "but soft deleted" : ""
                }`,
            });
        } else {
            next();
        }
    }

    hasSubstring (email: string): boolean {
        return ALLOWED_EMAIL_SUFFIX.some(suffix => email.includes(suffix));
    }

    async validateEmail(email:string){
        try {
            if (email){
                if(!this.hasSubstring(email)){
                    throw loginError;
                }
                let item = await userService.getUserByEmail(email);
                if (item && item.id) {
                    return true;
                }
                return false;                                                                                                                                                                               
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    async validateSameEmailBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user && user.id === Number(req.params.userId)) {
            next();
        } else {
            res.status(400).send({ message: "Invalid email" });
        }
    }

    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.email) {
            log("Validating email", req.body.email);

            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };
    

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(Number(req.params.userId));
        if (user) {
            next();
        } else {
            res.status(404).send({
                message: `User ${req.params.userId} not found`,
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();
