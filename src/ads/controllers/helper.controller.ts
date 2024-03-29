import  express from "express";
import AdsApiBaseController from "./base.controller";
import  dotenv from "dotenv";
dotenv.config();
const {Client} = require("../../clients/models");
var SET_EMAIL_MESSAGE = require("../utils/mailBody");
const mailTransporter = require("../utils/mail");

export default class AdsApiHelperController extends AdsApiBaseController{
    constructor() {
        super();
        this.sendMail = this.sendMail.bind(this)
        this.sendMailToUser = this.sendMailToUser.bind(this)
    }

    /**
     * @param schedule
     * @param history
     * sends email to campaign associate user
     * @returns by API route call
     */
    async sendMail(
        schedule,
        history
    ) {
        const {customerId} = schedule
        try {
            const client = await Client.findOne({
                where: {
                    remoteClientId: customerId,
                }
            })

            if(client) {
                console.log('teamEmails', client?.teamEmails)
                const teamEmails = client?.teamEmails
                for (const email of teamEmails) {
                    await this.sendMailToUser(history, email)
                }
            } else {
                console.log("No Client Emails found for sent email notification!")
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    /**
     * @param email
     * @param history
     * sends email to campaign associate user
     * @returns by API route call
     */
    async sendMailToUser(history, email) {
        let messageOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            subject: process.env.MAIL_SUBJECT,
            to: '',
            html: ''
        }
        messageOptions.to = email
        messageOptions.html = SET_EMAIL_MESSAGE(history, email);
        await mailTransporter.sendMail(messageOptions);
        console.log('Email sent to: ' + email)
    }
}
