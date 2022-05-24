import express from "express";

import jwt from "jsonwebtoken";
import usersService from "../services/users.service";
// import argon2 from "argon2";
import debug from "debug";
import { UserDto } from "../dto/user.dto";

const log: debug.IDebugger = debug("app:users-controller");
//get access tokens
const generateAccessToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    );
};

// get refresh tokens
let refreshTokens = [];
const generateRefreshToken = (user: UserDto) => {
    const refreshToken = jwt.sign(
        { email: user.email, id: user.id },
        "refreshSecret",
        {
            expiresIn:
                process.env?.JWT_REFRESH_TOKEN_EXPIRY || process.env.JWT_EXPIRY,
        }
    );

    refreshTokens.push(refreshToken);
    return refreshToken;
};
class UsersController {
    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list(100, 0);
        res.status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(Number(req.params.userId));
        if (!user) {
            return res.status(404).send("not found");
        }
        res.status(200).send(user);
    }

    async createUser(req: express.Request, res: express.Response) {
        req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
        const userId = await usersService.create(req.body);
        res.status(201).send({ id: userId });
    }

    async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
        }
        log(await usersService.patchById(req.body));
        res.status(204).send("");
    }

    async put(req: express.Request, res: express.Response) {
        req.body.password = "1ag4alkaaljf"; //await argon2.hash(req.body.password);
        const userObj: UserDto = {
            id: req.params.userId,
            ...req.body,
        };
        const resp: UserDto = await usersService.updateById(userObj);
        // log(resp);
        res.status(204).send(resp);
    }

    async removeUser(req: express.Request, res: express.Response) {
        log(await usersService.deleteById(Number(req.params.userId)));
        res.status(204).send("");
    }

    async login(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const user = await usersService.getUserByEmail(req.body.email);
            if (user && user.id) {
                const userObject = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };

                const accessToken = generateAccessToken(userObject);
                const refreshToken = generateRefreshToken(userObject);

                //saving refresh token on users table
                user.refreshToken = req.body.refreshToken;
                user.save();

                return { accessToken, refreshToken, userObj: user };
            }

            throw { status: 401, message: process.env.LOGIN_ERROR_MESSAGE };
        } catch (err) {
            next(err);
        }
    }
}

export default new UsersController();
