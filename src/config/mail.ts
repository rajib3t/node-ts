import * as dotenv from 'dotenv';
dotenv.config();
const mailConfig = {
    smpt :{
        host:process.env.MAIL_HOST as string,
        port:Number(process.env.MAIL_PORT) || 587,
        
        auth:{
            user:process.env.MAIL_USERNAME as string, 
            pass:process.env.MAIL_PASSWORD as string,
            ssl:process.env.MAIL_ENCRYPTION || false,
        }
    }
    
    
};

export default mailConfig;