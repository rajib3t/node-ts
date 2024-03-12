import { Model, DataTypes } from "sequelize";

import Database from "../config/database";

class AdminPasswordReset extends Model {
  public id!: number;
  public email!: string;
  public token!: string;
  public created_at!: Date;
}

AdminPasswordReset.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: Database.getInstance().getSequelize(),
    tableName: "admin_password_resets",
    modelName: "AdminPasswordReset",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default AdminPasswordReset;