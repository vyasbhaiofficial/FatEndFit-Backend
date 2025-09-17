const nodemailer = require('nodemailer');

const createTransport = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
    });
};

exports.sendResetEmail = async ({ to, subject = 'Reset your password', html }) => {
    const transporter = createTransport();

    // Fallback: if transporter is not configured, log the email content
    if (!transporter) {
        console.log('Email transport not configured. Would have sent email:', { to, subject, html });
        return { queued: false, simulated: true };
    }

    const from = process.env.MAIL_FROM || 'no-reply@fatendfit.com';
    const info = await transporter.sendMail({ from, to, subject, html });
    return { queued: true, messageId: info.messageId };
};
