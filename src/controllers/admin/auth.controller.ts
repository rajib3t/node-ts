import {NextFunction, Request, Response, response } from 'express';
import { Router } from 'express';
import { AuthService } from '../../services/auth.service';
import { log } from 'console';
import  User  from '../../models/user.model';
import { authMiddleware } from '../../middlewares/auth.middleware';



class AuthController{
    public router: Router = Router();

    constructor(){
        
        this.init();
    }

    init(){
        this.router.post('/login', this.login);
        this.router.post('/refresh-token', this.refreshToken);
        this.router.post('/logout', this.logout);
        this.router.get('/user',authMiddleware, this.getLoggedInUser);
        this.router.post('/reset-password',this.resetPassword)
    }

    private async login(req:Request, res:Response, next:NextFunction) :Promise<any>{
        
        try{
          
            const auth = new AuthService();
            const user =  await auth.loginWithEmailPassword(req.body.email, req.body.password);
            res.cookie(
                'refreshToken', 
                user.refreshToken, {
                    httpOnly:true,
                    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
                });
            
            let {refreshToken,data, ...response} = user;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(response)
            
        }catch(error){
            
            next(error)
        }
        
        
    }
   

  
    private async setUserData(user:any){
        return user;
    }
    
    private async refreshToken(req:Request, res:Response){
        const refreshToken = req.cookies['refreshToken'];
        if(!refreshToken){
            return res.status(401).json({ error: 'Access denied' });
        }

        const authService = new AuthService();
        const dbRefreshToken = await authService.getRefreshToken(refreshToken);
        if(!dbRefreshToken){
            return res.status(401).json({ error: 'Access denied' });
        }
        const token = await authService.refreshAccessToken(refreshToken.token);
        
        
        if(!token){
            return res.status(401).json({ error: 'Access denied' });
        }

        res.send(token);
        
       
    }

    private async logout(req:Request, res:Response){
        const refreshToken = req.cookies['refreshToken'];
        const authService = new AuthService();
        authService.logout(refreshToken);
        res.cookie('accessToken', "", {maxAge: 0});
        res.cookie(
            'refreshToken',
            "",
            {
                httpOnly:true,
                maxAge: 0 // 7 days
            });
        res.send({message:"Logout Successful"});
    }

    private async getLoggedInUser(req:Request, res:Response){
        
        const token = req.header('Authorization')?.split(" ")[1] || "";
       
        const authService = new AuthService();
        const user = await authService.getUserFromToken(token);
        
        res.send(
            {
                status:true,
                code:200,
                message:"Logged In User",
                data:{
                    uuid:user?.uuid,
                    firstName:user?.firstname,
                    lastName:user?.lastname,
                    email:user?.email,
                    is_admin:user?.is_admin
                }
            }
        )

       
    }

    private async resetPassword(req:Request, res:Response){
        if(!req.body.email){
            return res.status(400).json({ error: 'Email is required' });
        }
        const {email} = req.body;
        const authService = new AuthService();
        const user = await authService.getUserByEmail(email);
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordReset = await authService.resetPassword(email);
        if(!passwordReset){
            return res.status(500).json({ error: 'Something went wrong' });
        }
        res.send({message:"Password reset link sent to your email"});

        authService.resetPasswordEmailSend(req, email,passwordReset.token )
    }

    

    
}

export default new AuthController();