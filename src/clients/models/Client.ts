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
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
    },
    {
        sequelize: sequelizeConnection,
        paranoid: true,
    }
);

export default Client;
