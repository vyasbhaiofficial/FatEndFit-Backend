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

// Generic notifier to multiple recipients
exports.sendNotificationEmail = async ({ to, subject, html }) => {
    const transporter = createTransport();
    if (!transporter) {
        console.log('Email transport not configured. Would have sent email:', { to, subject, html });
        return { queued: false, simulated: true };
    }
    const from = process.env.MAIL_FROM || 'no-reply@fatendfit.com';
    const info = await transporter.sendMail({ from, to, subject, html });
    return { queued: true, messageId: info.messageId };
};

// Theme variables
const THEME = {
    background: '#ffffff',
    foreground: '#171717',
    primary: '#facc15',
    secondary: '#111827',
    yellowLight: '#f7d647',
    yellowDark: '#f1be3d'
};

// Build a modern, attractive email using the app theme
exports.renderSubadminActionEmail = ({
    heading = 'Sub Admin Activity',
    actor = 'Sub Admin',
    intro = '',
    items = [], // [{ label, value }]
    footerNote = 'This is an automated notification.'
}) => {
    const rows = items
        .filter(Boolean)
        .map(
            r => `
            <tr>
              <td style="padding:10px 12px;color:${THEME.secondary};opacity:.8">${r.label}</td>
              <td style="padding:10px 12px;color:${THEME.foreground};font-weight:600">${r.value}</td>
            </tr>
        `
        )
        .join('');

    return `
   <div style="background:${THEME.background};padding:24px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:${
                THEME.background
            };border:1px solid rgba(0,0,0,.06);border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(17,24,39,.08)">
              <tr>
                <td style="background:linear-gradient(135deg, ${THEME.primary}, ${THEME.yellowDark});padding:22px 24px;text-align:center">
                  <div style="color:${THEME.secondary}">
                    <div style="font-size:14px;opacity:.8;">FatEndFit • Notification</div>
                    <div style="font-size:20px;font-weight:800;color:${THEME.secondary}">${heading}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 24px;color:${THEME.foreground}">
                  <p style="margin:0 0 12px 0;font-size:16px;line-height:1.5">${intro}</p>
                  <div style="border:1px solid rgba(0,0,0,.06);border-radius:12px;overflow:hidden">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr style="background:${THEME.background}">
                        <td colspan="2" style="padding:12px 12px;background:${
                            THEME.background
                        };border-bottom:1px solid rgba(0,0,0,.06);color:${THEME.secondary};font-weight:700">
                          Performed by: <span style="color:${THEME.secondary};font-weight:800">${actor}</span>
                        </td>
                      </tr>
                      ${rows}
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px 22px 24px">
                  <div style="color:${THEME.secondary};opacity:.7;font-size:12px">${footerNote}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <div style="text-align:center;margin-top:14px;color:${
          THEME.secondary
      };opacity:.5;font-size:12px">© ${new Date().getFullYear()} FatEndFit</div>
    </div>`;
};
