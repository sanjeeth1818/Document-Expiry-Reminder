const nodemailer = require('nodemailer');
require('dotenv').config();

// Create SMTP Transporter
const createTransporter = () => {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log('⚠️ SMTP credentials not configured. Using Mock Mailer (logs to console).');
    return {
      sendMail: async (mailOptions) => {
        console.log('\n--- ✉️ MOCK EMAIL SENT ---');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('-------------------------\n');
        return { messageId: 'mock-id-' + Date.now() };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const sendEmailNotification = async ({
  eventType,
  personName,
  personEmail,
  docName,
  docNumber,
  expiryDate,
  customRecipients = [],
  sendToPerson = true,
  sendToUser = true
}) => {
  const recipients = [];

  if (sendToPerson && personEmail) recipients.push(personEmail);
  if (sendToUser && process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com') {
    if (!recipients.includes(process.env.SMTP_USER)) recipients.push(process.env.SMTP_USER);
  }
  if (customRecipients && customRecipients.length > 0) {
    customRecipients.forEach(email => {
      if (email && !recipients.includes(email)) recipients.push(email);
    });
  }

  if (recipients.length === 0) {
    console.log(`No email recipients configured for document "${docName}".`);
    return;
  }

  // -- Event Config --
  const eventConfig = {
    added:   { accentColor: '#16a34a', badgeBg: '#dcfce7', badgeText: '#15803d', badgeLabel: 'New Tracker',       subject: '✅ New Document Tracker Added',         headline: 'New Tracker Created',          body: `A new document tracker has been created for <strong>${personName}</strong>.` },
    deleted: { accentColor: '#6b7280', badgeBg: '#f3f4f6', badgeText: '#374151', badgeLabel: 'Tracker Removed',   subject: '🗑️ Document Tracker Removed',           headline: 'Tracker Removed',               body: `The document tracker for <strong>${personName}</strong> has been deleted from the system.` },
    muted:   { accentColor: '#9ca3af', badgeBg: '#f3f4f6', badgeText: '#6b7280', badgeLabel: 'Reminders Paused',  subject: '🔕 Reminders Paused',                   headline: 'Email Reminders Paused',        body: `Email reminder notifications for this document have been <strong>paused</strong>. You will not receive further alerts unless reminders are resumed.` },
    unmuted: { accentColor: '#3b82f6', badgeBg: '#dbeafe', badgeText: '#1d4ed8', badgeLabel: 'Reminders Active',  subject: '🔔 Reminders Resumed',                  headline: 'Email Reminders Resumed',       body: `Email reminder notifications for this document have been <strong>resumed</strong>. You will receive daily alerts from the reminder start date.` },
    renewed: { accentColor: '#16a34a', badgeBg: '#dcfce7', badgeText: '#15803d', badgeLabel: 'Renewed',           subject: '🔄 Document Renewed Successfully',       headline: 'Document Renewed',              body: `The document has been successfully renewed with an updated expiry date. Reminders are now active.` },
    alert:   { accentColor: '#f59e0b', badgeBg: '#fef9c3', badgeText: '#b45309', badgeLabel: 'Expiring Soon',     subject: `⚠️ Expiry Reminder: ${docName}`,          headline: 'Action Required',               body: `The following document is approaching its expiry date. Please renew it before the expiry date to avoid disruption.` },
    expired: { accentColor: '#dc2626', badgeBg: '#fee2e2', badgeText: '#b91c1c', badgeLabel: 'Expired',           subject: `🚨 Document Expired: ${docName}`,         headline: 'Document Has Expired',          body: `The following document has <strong>expired</strong>. Please renew it immediately to restore its validity.` },
  };

  // Determine if alert is actually expired
  let resolvedType = eventType;
  if (eventType === 'alert' && expiryDate && new Date() > new Date(expiryDate)) {
    resolvedType = 'expired';
  }

  const cfg = eventConfig[resolvedType] || eventConfig['alert'];
  const accentColor = cfg.accentColor;

  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  // -- Table rows for details section --
  const rows = [
    { label: 'Document', value: docName },
    docNumber ? { label: 'ID / Ref. No.', value: docNumber } : null,
    { label: 'Owner', value: personName },
    formattedExpiry ? { label: 'Expiry Date', value: `<span style="color:${accentColor};font-weight:700;">${formattedExpiry}</span>` } : null,
  ].filter(Boolean);

  const tableRows = rows.map(row => `
    <tr>
      <td style="padding: 11px 0; border-bottom: 1px solid #f1f5f9; width: 140px; vertical-align: top;">
        <span style="font-size: 13px; color: #6b7280; font-weight: 500;">${row.label}</span>
      </td>
      <td style="padding: 11px 0 11px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
        <span style="font-size: 13px; color: #111827; font-weight: 600;">${row.value}</span>
      </td>
    </tr>
  `).join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${cfg.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8;padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;max-width:100%;">

          <!-- Top Accent Bar -->
          <tr>
            <td style="background-color:${accentColor};height:5px;font-size:1px;line-height:1px;">&nbsp;</td>
          </tr>

          <!-- Card Body -->
          <tr>
            <td style="padding:32px 36px 28px 36px;">

              <!-- Logo + Badge Row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td>
                    <span style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">DocExpire</span>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background-color:${cfg.badgeBg};color:${cfg.badgeText};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:5px 12px;border-radius:9999px;">${cfg.badgeLabel}</span>
                  </td>
                </tr>
              </table>

              <!-- Headline -->
              <p style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#0f172a;line-height:1.3;">${cfg.headline}</p>

              <!-- Body Text -->
              <p style="margin:0 0 28px 0;font-size:14px;color:#4b5563;line-height:1.7;">${cfg.body}</p>

              <!-- Details Table Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;padding:4px 20px;margin-bottom:28px;">
                <tr><td>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${tableRows}
                  </table>
                </td></tr>
              </table>

              <!-- Footer Text -->
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;border-top:1px solid #f1f5f9;padding-top:20px;text-align:center;">
                This is an automated notification from your <strong>DocExpire</strong> system.&nbsp; No reply is needed.
              </p>

            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>
  <!-- End Wrapper -->

</body>
</html>
  `.trim();

  const textContent = [
    `[${cfg.badgeLabel.toUpperCase()}] ${cfg.headline}`,
    '-------------------------------------------',
    `Document  : ${docName}`,
    docNumber ? `ID / Ref. : ${docNumber}` : null,
    `Owner     : ${personName}`,
    formattedExpiry ? `Expiry    : ${formattedExpiry}` : null,
    '',
    cfg.body.replace(/<[^>]*>/g, ''),
    '',
    'This is an automated message from DocExpire.'
  ].filter(v => v !== null).join('\n');

  const mailOptions = {
    from: process.env.SMTP_FROM || `"DocExpire" <${process.env.SMTP_USER}>`,
    to: recipients.join(', '),
    subject: `${cfg.subject} — ${personName}`,
    text: textContent,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [${resolvedType.toUpperCase()}] Email sent for "${docName}" → ${recipients.join(', ')}`);
    return info;
  } catch (error) {
    console.error(`❌ Email failed for "${docName}" (${personName}): ${error.message}`);
    throw error;
  }
};

module.exports = { sendEmailNotification, transporter };
