import { Model, DataTypes } from "sequelize";
import Database from "../config/database";
import User from "./user.model";
class Token extends Model {
  public id!: number;
  public token!: string;
  public user_id!: number;
  public is_revoked!: boolean;
  public expires!: Date;
  public type!: string;
}

Token.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expires: {
      type: DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: Database.getInstance().getSequelize(),
    tableName: "user_tokens",
    modelName: "Token",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }

);

// Token.belongsTo(User, {
//     foreignKey: "userId",
//     as: "User",
// });
export default Token;