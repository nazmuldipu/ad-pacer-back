import { User } from "../users/models";
import { Client } from "../clients/models";

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV !== "test";

const dbInit = () => {
    User.sync({ alter: isDev || isTest });
    Client.sync({ alter: isDev || isTest });
};

export default dbInit;
