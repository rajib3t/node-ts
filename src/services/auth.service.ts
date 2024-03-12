import User from '../models/user.model';
import AdminPasswordReset from '../models/adminpasswordreset.model';
import httpStatus from 'http-status';
const bcrypt = require("bcrypt")
import TokenService from './token.service';
import { AES } from 'crypto-ts';
import { randomBytes } from 'crypto';
// Email Tempate 
import resetPassword from '../templates/resetpassword.template';

import MailService from './mail.service';
import { Response  } from 'express';



export  class AuthService {

    private res?:Response;
    constructor(){}

    async loginWithEmailPassword(email:string, password:string){

        
        try{
            const user = await User.unscoped().findOne({where:{email:email}});
           
            
            if(!user){
                return {
                    status:false,
                    code:httpStatus[400],
                    message:"User not found",
                    
                }

            }
            const isPasswordValid =  await this.isPasswordValid(password, user?.password);
            
            
            if(!isPasswordValid){
                return {
                    status:false,
                    code:httpStatus[400],
                    message:"Invalid password",
                    

                }
            }
            let token = {}
            const tokenService = new TokenService();
            token = await tokenService.generateToken(user);
            let revokeTokens = await tokenService.revokesOfUser(user);
            let refreshToken = await tokenService.generateRefreshToken(user);
            let saveToken = await tokenService.saveToken(refreshToken, user);
            
            
            
           return {
                status:true,
                code:httpStatus[200],
                message:"Login Successful",
                data:{
                    uuid:user.uuid,
                    firstName:user.firstname,
                    lastName:user.lastname,
                    email:user.email,
                    is_admin:user.is_admin
                },
                token:token,
                refreshToken:refreshToken
           }
        } catch(error){
            throw error;
        }
        
    }


    private async isPasswordValid(password:string, hash:string){
        return bcrypt.compareSync(password, hash);
    }


    async refreshAccessToken(refreshToken:string){
        const tokenService = new TokenService();
        const decoded:any = await tokenService.verifyToken(refreshToken);
        
       
        const newToken = await tokenService.generateToken(decoded);
        
        return {
            token:newToken,
            
        }
    }


    async getRefreshToken(refreshToken:string){
        const tokenService = new TokenService();
        const token = await tokenService.getRefreshToken(refreshToken);

        return token;
    }

    async logout(refreshToken:string){
        const tokenService = new TokenService();
        const token = await tokenService.revokeToken(refreshToken);
        return token;
    }

    async getUserFromToken(token:string){
        const tokenService = new TokenService();
        const decoded:any = await tokenService.verifyToken(token);
        
        
        const user = await User.findOne({where:{uuid:decoded.uuid}});
        return user;
    }
    
    async getUserByEmail(email:string){
        const user = await User.unscoped().findOne({where:{email:email}});

        if(!user){
            return {
                status:false,
                
                
            }
        }

        return {
            status:true,
            user:user
        }
    }


    async resetPassword(email:string){
        const user = await User.unscoped().findOne({where:{email:email}});
        if(!user){
            return false;

        }
        let token = AES.encrypt(randomBytes(32).toString('hex'), 'test').toString();
        const passwordReset = await AdminPasswordReset.create({email:email, token:token});
        return passwordReset;


    }

    async resetPasswordEmailSend(req:any, email:string, token:string){
        const user = await this.getUserByEmail(email)
        let firstname = user.user?.firstname;
        const resetPasswordTemplate = resetPassword(firstname,token);
        const mailservice = MailService.getInstance();
        
        
        await mailservice.sendMail(
            req.headers['X-Request-Id'],{
                to: email,
                subject: 'Reset Password',
                html: resetPasswordTemplate.html,
            }

        )

    }

}


