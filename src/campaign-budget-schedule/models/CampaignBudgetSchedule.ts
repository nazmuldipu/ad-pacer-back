import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../../db/config";
import { CampaignBudgetSchedule } from "../dto/campaign-budget-schedule";

export interface CampaignBudgetScheduleInput extends Optional<CampaignBudgetSchedule, "id"> {}

export interface CampaignBudgetScheduleOutput extends Required<CampaignBudgetSchedule> {}

class CampaignBudgetSchedule extends Model<CampaignBudgetSchedule, CampaignBudgetScheduleInput> implements CampaignBudgetSchedule {
    public id!: number;
    public campaignId!: string;
    public budgetId!: string;
    public runDate!: string;
    public dayOfTheWeek!: string;
    public endHour!: string;
    public endMinute!: string;
    public startMinute!: string;
    public startHour!: string;
    public amount!: string;
    public customerId!: string;
    public loginCustomerId!: string;
    public customerTimezone!: string;
    public createdByUserId!: string;
    public status!: string;
    public dateExecuted!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}

CampaignBudgetSchedule.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        campaignId: {
            type: DataTypes.STRING
        },
        budgetId: {
            type: DataTypes.STRING
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
            allowNull: false
        },
        loginCustomerId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customerTimezone: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        createdByUserId: DataTypes.INTEGER,
        dateExecuted: DataTypes.DATE,
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        deletedAt: {
            allowNull: true,
            type: DataTypes.DATE
        }
    },
    {
        sequelize: sequelizeConnection,
        modelName: "CampaignBudgetSchedule",
        tableName: "campaign_budget_schedules",
        paranoid: true,
    }
);

export default CampaignBudgetSchedule;
