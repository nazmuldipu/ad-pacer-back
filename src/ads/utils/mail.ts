const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.sendgrid.net2",
    port: process.env.MAIL_PORT || 5872,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME, // user
        pass: process.env.MAIL_PASSWORD, // password
    },
});

module.exports = transporter