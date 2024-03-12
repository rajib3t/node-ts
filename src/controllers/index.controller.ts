import { Request, Response } from 'express';
import { Router } from 'express';
class IndexController {
    
    public router: Router = Router();

    constructor(){
        this.init();
    }

    init(){
        this.router.get('/', this.index);
    }


    private index(req:Request, res:Response) {
        res.send('Hello World');
    }
}

export default new IndexController().router;