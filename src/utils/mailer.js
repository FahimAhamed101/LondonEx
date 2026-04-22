const nodemailer = require("nodemailer");

let transporter = null;

function normalizeEnvValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getMailerConfig() {
  const host = normalizeEnvValue(process.env.SMTP_HOST);
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = normalizeEnvValue(process.env.SMTP_USER);
  const pass = normalizeEnvValue(process.env.SMTP_PASS);
  const fromEmail = normalizeEnvValue(process.env.SMTP_FROM_EMAIL) || user;
  const fromName = normalizeEnvValue(process.env.SMTP_FROM_NAME) || "London & Essex Electrical Training";

  return {
    host,
    port,
    user,
    pass,
    fromEmail,
    fromName,
  };
}

function ensureMailerConfig() {
  const config = getMailerConfig();

  if (!config.host || !config.port || !config.user || !config.pass || !config.fromEmail) {
    throw new Error("SMTP is not configured");
  }

  return config;
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const config = ensureMailerConfig();

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return transporter;
}

function buildFromHeader(fromName, fromEmail) {
  return fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;
}

async function sendPasswordResetEmail({ to, name, code, expiresInMinutes, resetUrl }) {
  const config = ensureMailerConfig();
  const mailTransport = getTransporter();
  const greeting = name ? `Hi ${name},` : "Hello,";

  const subject = "Your password reset code";
  const text = [
    greeting,
    "",
    "We received a request to reset your password.",
    `Your 6-digit password reset code is: ${code}`,
    `This code expires in ${expiresInMinutes} minutes.`,
    "",
    `You can also reset your password here: ${resetUrl}`,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <p>${greeting}</p>
      <p>We received a request to reset your password.</p>
      <p>
        Your 6-digit password reset code is:
        <strong style="font-size: 22px; letter-spacing: 4px;">${code}</strong>
      </p>
      <p>This code expires in ${expiresInMinutes} minutes.</p>
      <p>
        You can also reset your password here:
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;

  return mailTransport.sendMail({
    from: buildFromHeader(config.fromName, config.fromEmail),
    to,
    subject,
    text,
    html,
  });
}

async function sendTrainingProviderSignatureRequestEmail({
  to,
  providerName,
  candidateName,
  courseTitle,
  subject,
  message,
  signatureLink,
  signatureApiUrl,
  expiresAt,
}) {
  const config = ensureMailerConfig();
  const mailTransport = getTransporter();
  const greeting = providerName ? `Hello ${providerName},` : "Hello,";
  const expiryLine = expiresAt
    ? `This signature link will expire on ${new Date(expiresAt).toLocaleString("en-GB")}.`
    : "";

  const text = [
    greeting,
    "",
    message || "A training provider signature has been requested.",
    "",
    candidateName ? `Candidate: ${candidateName}` : "",
    courseTitle ? `Course: ${courseTitle}` : "",
    "",
    `Open the signature link: ${signatureLink}`,
    signatureApiUrl ? `API fallback: ${signatureApiUrl}` : "",
    expiryLine,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <p>${greeting}</p>
      <p>${message || "A training provider signature has been requested."}</p>
      ${candidateName ? `<p><strong>Candidate:</strong> ${candidateName}</p>` : ""}
      ${courseTitle ? `<p><strong>Course:</strong> ${courseTitle}</p>` : ""}
      <p>
        <a href="${signatureLink}" style="display:inline-block;padding:12px 18px;background:#0ea5e9;color:#ffffff;text-decoration:none;border-radius:8px;">
          Open Signature Link
        </a>
      </p>
      ${signatureApiUrl ? `<p>If the button does not work, use this link: <a href="${signatureApiUrl}">${signatureApiUrl}</a></p>` : ""}
      ${expiryLine ? `<p>${expiryLine}</p>` : ""}
    </div>
  `;

  return mailTransport.sendMail({
    from: buildFromHeader(config.fromName, config.fromEmail),
    to,
    subject: subject || "Please add your training provider signature",
    text,
    html,
  });
}

module.exports = {
  sendPasswordResetEmail,
  sendTrainingProviderSignatureRequestEmail,
};
