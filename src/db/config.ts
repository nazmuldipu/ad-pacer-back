import { Dialect, Sequelize } from 'sequelize'
import config from "config";

const dbName: string = config.get("database");
const dbUser: string = config.get("username");
const dbHost: string = config.get("host");
const dbDriver: Dialect = config.get("dialect");
const dbPassword: string = config.get("password");

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver
})

export default sequelizeConnection