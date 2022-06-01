import Joi, {ValidationResult} from "joi";
import jwt from "jsonwebtoken";
import express from "express";

const publicURL = [
    "/user/login",
    "/user/registration",
    "/ads-api/oauth2/login",
    "/ads-api/get-access-token",
    "/set-campaign-budget-schedule-job",
];
const ERROR_MESSAGE = "Authentication failed!";
const error = { status: 401, message: ERROR_MESSAGE };

interface ContentDto {
    "access-token": string;
    "refresh-token": string;
    "Authorization": string;
    "userRefreshToken": string;
}

export default function ValidateAuthRoute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const found = publicURL.find((item) => {
        if (item === req.path) {
            return item;
        } else if (item.includes(req.path)) {
            return item;
        }
        return null;
    });
    if (!found) {
        function validateContents(content: ContentDto):ValidationResult<any> {
            const JoiSchema = Joi.object({
                "access-token": Joi.string().required(),
                "refresh-token": Joi.string().required(),
                Authorization: Joi.string().required(),
                userRefreshToken: Joi.string().required(),
            }).options({ abortEarly: false });

            return JoiSchema.validate(content);
        }

        const content: ContentDto = {
            "access-token": req.headers["access-token"] as string,
            "refresh-token": req.headers["refresh-token"] as string,
            Authorization: req.headers["authorization"],
            userRefreshToken: req.headers["userrefreshtoken"] as string,
        };

        let response = validateContents(content);

        if (response.error) {
            throw {
                message: ERROR_MESSAGE,
                status: 401,
                errors: response.error?.details,
            };
        } else {
            const { authorization } = req.headers;
            const token = authorization.split(" ")[1];
            const { id, email } = jwt.verify(token, process.env.JWT_SECRET);
            if (!email) {
                throw error;
            }
            req['authUser'] = {
                id,
                email,
            };
        }
    }
    next();
}
