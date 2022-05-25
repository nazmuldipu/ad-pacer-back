import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../../db/config";
import { UserDto } from "../dto/user.dto";

export interface UserInput extends Optional<UserDto, "id" | "email"> {}

export interface UserOutput extends Required<UserDto> {}

class User extends Model<UserDto, UserInput> implements UserDto {
    public id!: number;
    public name!: string;
    public email!: string;
    public refreshToken!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        refreshToken: {
            type: DataTypes.TEXT,
        }
    },
    {
        sequelize: sequelizeConnection,
        paranoid: true,
        modelName: 'User',
        tableName: 'users',
    }
);

export default User;
