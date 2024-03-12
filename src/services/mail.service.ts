import nodemailer from 'nodemailer';
import mailConfig  from '../config/mail';
import { MailInterface } from '../interfaces/mailInterface';
import * as dotenv from 'dotenv';
import { log } from 'console';
import { exit } from 'process';
dotenv.config();
export default class MailService {
    private static instance: MailService;
    private transporter :any;

    private constructor() {
        this.createConnection();
    }
    //INSTANCE CREATE FOR MAIL
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }

    async createConnection() {
        this.transporter = nodemailer.createTransport(mailConfig.smpt);

        

    }

    async sendMail(
        requestId: string | number | string[],
        options: MailInterface){
            log({
                from:`"${process.env.MAIL_FROM_NAME as string }" ${process.env.MAIL_FROM_ADDRESS as string || options.from}`,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            })
            
            return await this.transporter.
            sendMail({
                from:`"${process.env.MAIL_FROM_NAME as string }" ${process.env.MAIL_FROM_ADDRESS as string || options.from}`,
                to: options.to,
                // cc: options.cc,
                // bcc: options.bcc,
                subject: options.subject,
                //text: options.text,
                html: options.html,
            })
            .then((info:any) => {
                
                return info;
            });
    }

    //VERIFY CONNECTION
    async verifyConnection() {
        return this.transporter.verify();
    }
    //CREATE TRANSPORTER
    getTransporter() {
        return this.transporter;
    }
}

