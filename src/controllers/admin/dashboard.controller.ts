import { Request, Response } from 'express';
import { Router } from 'express';
import {authMiddleware} from '../../middlewares/auth.middleware';

class DashboardController{
    public router: Router = Router();
   
    constructor(){
        
        this.init();
    }

    init(){
        this.router.get('/dashboard', authMiddleware, this.dashboard);
    }

    private async dashboard(req:Request, res:Response){
        
        res.send({message: 'Hello from dashboard'});
    }
}

export default new DashboardController();