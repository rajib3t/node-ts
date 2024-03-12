import { log } from 'console';
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
dotenv.config();

class Database {

    private static instance: Database;
    private sequelize: Sequelize;

    private constructor() {

        this.sequelize = new Sequelize({
            dialect:process.env.CONNECTION as 'mysql'|'postgres'|'sqlite'|'mariadb'|'mssql'|undefined,
            host: process.env.DB_HOST,
            username: process.env.DB_USER as string,
            password: process.env.DB_PASSWORD as string,
            database: process.env.DB_NAME as string,
            port: Number(process.env.DB_PORT),
            models: [__dirname + '../models'],
            define: {
                timestamps: false,
            },
            logging:false
            
        });

        this.sequelize.authenticate().then(() => {
            log('Database connected');
        }).catch((err) => {
            log(err);
        });
        

    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();

            
        }

        return Database.instance;
    }

    public getSequelize(): Sequelize {
        
        return this.sequelize;
    }



}

export default Database;