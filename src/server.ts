import express from 'express';
import * as dotenv from 'dotenv';
import router from './routes';
import Database from './config/database';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
class Server{
    private app: express.Application;
    private port: number;
    private db: any; 

    constructor(){
        this.app = express();
        
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200'],
            credentials: true
        }));
        this.port = Number(process.env.PORT) || 3000;
        this.app.use('/api',router);
        this.initDatabase();

    }

    initDatabase(){
            this.db = Database.getInstance();
        }

    start(callback: Function){
        
        this.app.listen(this.port, callback(

        ));
    }
}


var app = new Server();
app.start(() => {
    console.log('Server is running on port '+process.env.PORT);
});