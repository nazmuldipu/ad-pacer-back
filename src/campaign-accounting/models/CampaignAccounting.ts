import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../../db/config";
import { CampaignAccounting } from "../dto/campaign-accounting";

export interface CampaignAccountingInput extends Optional<CampaignAccounting, "id"> {}

export interface CampaignAccountingOutput extends Required<CampaignAccounting> {}

class CampaignAccounting extends Model<CampaignAccounting, CampaignAccountingInput> implements CampaignAccounting {
    public id!: number;
    public campaignId!: string;
    public totalBudgetAmount!: string;
    public totalCostAmount!: string;
    public additionalCostAmount!: string;
    public budgetSavedAmount!: string;
    public totalCampaignRunDays!: string;
    public campaignPassedDays!: string;
    public campaignRemainingDays!: string;
    public loginCustomerId!: string;
    public createdByUserId!: string;
    public status!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

CampaignAccounting.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        campaignId: {
            type: DataTypes.STRING
        },
        totalBudgetAmount: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        totalCostAmount: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        additionalCostAmount: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        budgetSavedAmount: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        totalCampaignRunDays: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        campaignPassedDays: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        campaignRemainingDays: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        loginCustomerId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdByUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: 'id',
            },
        },
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
        paranoid: true,
    }
);

export default CampaignAccounting;
