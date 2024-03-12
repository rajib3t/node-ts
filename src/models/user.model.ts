import { DataTypes, Model } from 'sequelize';
import Database from '../config/database'
import Token from './token.model';
import { IUser } from '../interfaces/IUser';


class User extends Model implements IUser{
    public id!: number;
    public uuid!: string;
    public firstname!: string;
    public lastname!: string;
    public email!: string;
    public mobile!: string;
    public password!: string;
    public is_admin!: boolean;
  
   
}
User.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    // deleted_at: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.NOW,
    // },
}, {
    sequelize: Database.getInstance().getSequelize(),
    modelName: 'User',
    underscored: true,
    timestamps: true,
    defaultScope: {
        attributes: {
          exclude: ['password','created_at','updated_at','createdAt','updatedAt']
        }
      },
    
})
//User.hasMany(Token);
export default User