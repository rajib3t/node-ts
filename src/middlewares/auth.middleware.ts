import { log } from "console";
import TokenService from "../services/token.service";
import { Request, Response, NextFunction } from "express";




export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   
        //const token = req.cookies['accessToken']
        const token = req.header('Authorization')?.split(" ")[1] || "";
        
        
        if (!token) return res.status(401).json({ error: 'Access denied' });
        try {
            const tokenService = new TokenService();
            const decoded:any = await tokenService.verifyToken(token);
           
           
            const { exp } = decoded
            if(!decoded.hasOwnProperty('exp')){
                return res.status(401).json({ error: 'Invalid token' });
            }
            if (Date.now() >= exp * 1000) {
                return res.status(401).json({ error: 'Token expired' });
            }
            req.body.useruuid = decoded.uuid;
            next();
         } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
         }
         };
        
       


