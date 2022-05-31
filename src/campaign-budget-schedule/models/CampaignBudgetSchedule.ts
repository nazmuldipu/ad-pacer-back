import { DataTypes, Model, Optional, Association, BelongsTo } from "sequelize";
import sequelizeConnection from "../../db/config";
import { CampaignBudgetScheduleDto } from "../dto/campaign-budget-schedule.dto";
import { User } from "../../users/models/index";

export interface CampaignBudgetScheduleInput extends Optional<CampaignBudgetScheduleDto, "id"> {}

export interface CampaignBudgetScheduleOutput extends Required<CampaignBudgetScheduleDto> {}

class CampaignBudgetSchedule extends Model<CampaignBudgetScheduleDto, CampaignBudgetScheduleInput> implements CampaignBudgetScheduleDto {
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
    public createdByUserId!: number;
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
    // static associations: {
    //     // define association here
    //     user: Association<User, CampaignBudgetSchedule>
    // }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        this.hasOne(models.User, {
            foreignKey: 'createdByUserId',
            as: 'user'
        })
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

CampaignBudgetSchedule.hasOne(User, {sourceKey: 'id', foreignKey: 'createdByUserId'})

export default CampaignBudgetSchedule;
