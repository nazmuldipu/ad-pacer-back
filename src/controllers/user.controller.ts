import { Request, Response } from "express";

export async function getUserHandler(req: Request, res: Response) {
    try {
        const users = {
            data: {
                id: 3,
                name: "true red",
                year: 2002,
                color: "#BF1932",
                pantone_value: "19-1664",
            },
            support: {
                url: "https://reqres.in/#support-heading",
                text: "To keep ReqRes free, contributions towards server costs are appreciated!",
            },
        };
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
}
