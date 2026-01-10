const nodemailer = require('nodemailer');
const { NotificationConfig } = require('../models');

const getTransporter = async () => {
    const config = await NotificationConfig.findOne({ where: { is_active: true } });

    if (config) {
        return {
            transporter: nodemailer.createTransport({
                host: config.smtp_host,
                port: config.smtp_port,
                secure: config.smtp_port === 465, // true for 465, false for other ports
                auth: {
                    user: config.smtp_user,
                    pass: config.smtp_pass,
                },
            }),
            sender: `Tickets SaaS <${config.sender_email}>`
        };
    }
    return null;
};

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const setup = await getTransporter();

        if (setup) {
            const { transporter, sender } = setup;
            const info = await transporter.sendMail({
                from: sender,
                to,
                subject,
                text,
                html: html || text // Fallback to text if no HTML
            });
            console.log("Email sent: %s", info.messageId);
            return true;
        } else {
            // Mock for dev / when no config
            console.log("---------------------------------------------------");
            console.log(`[MOCK EMAIL] To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Content: ${text}`);
            console.log("---------------------------------------------------");
            return false;
        }
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

module.exports = { sendEmail };
