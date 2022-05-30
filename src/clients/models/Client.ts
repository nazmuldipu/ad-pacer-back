import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../../db/config";
import { ClientDto } from "../dto/client.dto";

export interface ClientInput extends Optional<ClientDto, "id"> {}

export interface ClientOutput extends Required<ClientDto> {}

class Client extends Model<ClientDto, ClientInput> implements ClientDto {
    public id!: number;
    public name!: string;
    public remoteClientId!: string;
    public createdByUserId!: string;
    public teamEmails!: string[];

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Client.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        remoteClientId: {
            type: DataTypes.STRING,
        },
        createdByUserId: {
            type: DataTypes.STRING,
        },
        teamEmails: {
            type: DataTypes.JSON,
            allowNull: false,
            get() {
                return JSON.parse(this.getDataValue("teamEmails"));
            },
            set(value) {
                return this.setDataValue("teamEmails", JSON.stringify(value));
            }

        },
    },
    {
        sequelize: sequelizeConnection,
        paranoid: true,
        modelName: "Client",
        tableName: "clients"
    }
);

export default Client;
