import jwt from 'jsonwebtoken';
import  User  from '../models/user.model'
import Token from '../models/token.model';
import { Op } from 'sequelize';
import { log } from 'console';

class TokenService{
    public static instance: TokenService;
    public secret = process.env.JWT_SECRET as string;
    

    generateToken = async (user:User) => {
        
        
        const token = await jwt.sign({  uuid: user?.uuid, email: user?.email }, this.secret, { expiresIn: '30s'  });
        return token;
    }

    generateRefreshToken = async (user:User) => {
            
            let expires = new Date();
            expires.setDate(expires.getDate() + 7);
            const token:any= await jwt.sign({  uuid: user?.uuid, email: user?.email }, this.secret, { expiresIn: '7d'  });
            return {
                'token':token,
                'expires': expires
            }
        }


    verifyToken = async (token: any) => {
        try {
            
            const decoded = await jwt.verify(token, this.secret);
            
            return decoded;
        } catch (error) {
            return error;
        }
    }

    // refreshAccessToken = async (token: string) => {
    //     try {
    //         const decoded = await jwt.verify(token, this.secret);
    //         const newToken = await jwt.sign({ uuid: decoded.uuid, email: decoded.email }, this.secret);
    //         return newToken;
    //     } catch (error) {
    //         return error;
    //     }
    // }

    saveToken = async (token: any, user: User) => {
        try {
            let tokenData  = {
                token:token.token,
                user_id:user.id,
                is_revoked:false,
                type:'admin',
                expires: token.expires

            }
            const saveToken = await Token.create(tokenData);
            return saveToken;
        } catch (error) {
            return error;
        }
    }

    revokesOfUser = async (user: User) => {
        try {
            const revoke = await Token.update({ is_revoked: true }, { where: { user_id: user.id } });
            return revoke;
        } catch (error) {
            return error;
        }
    }

    revokeToken = async (token: string) => {
        try {
            const revoke = await Token.update({ is_revoked: true }, { where: { token: token } });
            return revoke;
        } catch (error) {
            return error;
        }
    }

    getRefreshToken = async (token: string) => {
        try {
            const refreshToken = await Token.findOne({ where: { token: token, is_revoked:false, expires:{
                [Op.gt]: new Date(),
            }} });
            return refreshToken;
        } catch (error) {
            return error;
        }
    }

    public static getInstance(): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();

            
        }

        return TokenService.instance;
    }

}

export default TokenService;