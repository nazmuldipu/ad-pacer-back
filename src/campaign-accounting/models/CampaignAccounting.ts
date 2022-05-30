import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../../db/config";
import { CampaignAccountingDto } from "../dto/campaign-accounting.dto";

export interface CampaignAccountingInput extends Optional<CampaignAccountingDto, "id"> {}

export interface CampaignAccountingOutput extends Required<CampaignAccountingDto> {}

class CampaignAccounting extends Model<CampaignAccountingDto, CampaignAccountingInput> implements CampaignAccountingDto {
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
    public createdByUserId!: number;
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
            type: DataTypes.STRING,
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
        modelName: 'CampaignAccounting',
        tableName: 'campaign_accounting'
    }
);

export default CampaignAccounting;
