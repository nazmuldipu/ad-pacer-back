import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Optional,
} from "sequelize";
import { CampaignBudgetSchedule } from "../../campaign-budget-schedule/models";
import sequelizeConnection from "../../db/config";
import { UserDto } from "../dto/user.dto";

export interface UserInput extends Optional<UserDto, "id" | "email"> {}

export interface UserOutput extends Required<UserDto> {}

class User
    extends Model<InferAttributes<User>, InferCreationAttributes<User>>
{
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare refreshToken: string;
    // declare campaignBudgetSchedules?: NonAttribute<CampaignBudgetSchedule[]>;

    // timestamps!
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date;
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
            type: DataTypes.STRING,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        deletedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize: sequelizeConnection,
        paranoid: true,
        modelName: "User",
        tableName: "users",
    }
);

// User.hasMany(CampaignBudgetSchedule, { sourceKey: "id", foreignKey: "createdByUserId", as: 'campaignBudgetSchedules' });

export default User;
