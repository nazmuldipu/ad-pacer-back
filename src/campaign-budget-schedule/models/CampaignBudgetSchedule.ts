import {
    DataTypes,
    Model,
    Optional,
    ForeignKey,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelizeConnection from "../../db/config";
import { User } from "../../users/models";
import { CampaignBudgetScheduleDto } from "../dto/campaign-budget-schedule.dto";

export interface CampaignBudgetScheduleInput
    extends Optional<CampaignBudgetScheduleDto, "id"> {}

export interface CampaignBudgetScheduleOutput
    extends Required<CampaignBudgetScheduleDto> {}

class CampaignBudgetSchedule extends Model<
    InferAttributes<CampaignBudgetSchedule>,
    InferCreationAttributes<CampaignBudgetSchedule>
> {
    declare id: CreationOptional<number>;
    declare campaignId: CreationOptional<string>;
    declare budgetId: CreationOptional<string>;
    declare runDate: CreationOptional<string>;
    declare dayOfTheWeek: CreationOptional<string>;
    declare endHour: CreationOptional<string>;
    declare endMinute: CreationOptional<string>;
    declare startMinute: CreationOptional<string>;
    declare startHour: CreationOptional<string>;
    declare amount: CreationOptional<string>;
    declare customerId: CreationOptional<string>;
    declare loginCustomerId: CreationOptional<string>;
    declare customerTimezone: CreationOptional<string>;
    declare createdByUserId: ForeignKey<User["id"]>;
    declare status: CreationOptional<string>;
    declare dateExecuted: CreationOptional<string>;

    // timestamps!
    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;
    declare readonly deletedAt: CreationOptional<Date>;
}

CampaignBudgetSchedule.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        campaignId: {
            type: DataTypes.STRING,
        },
        budgetId: {
            type: DataTypes.STRING,
        },
        runDate: {
            allowNull: false,
            type: DataTypes.DATEONLY,
        },
        dayOfTheWeek: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        endHour: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        endMinute: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        startMinute: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        startHour: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        amount: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        customerId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        loginCustomerId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customerTimezone: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        dateExecuted: DataTypes.DATE,
        status: {
            type: DataTypes.STRING,
            allowNull: true,
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
        modelName: "CampaignBudgetSchedule",
        tableName: "campaign_budget_schedules",
        paranoid: true,
    }
);

CampaignBudgetSchedule.belongsTo(User, {
    foreignKey: "createdByUserId",
    as: "user",
});

export default CampaignBudgetSchedule;
