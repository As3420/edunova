const sgMail = require("@sendgrid/mail");
const { InternalServerError } = require("http-errors"); // or use your custom error
const logger = require("../logger");
const EmailTemplates = require("../constant/EmailTemplates");
const config = require("../../config/config");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class SendGridService {
  constructor() {
    this.fromEmail = config.SENDGRID_FROM_EMAIL;
    this.toEmail = config.ADMIN_EMAIL_ENQUIRY;
  }

  async sendMail(to, subject, text, html) {
    const msg = {
      to,
      from: this.fromEmail,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      logger.info(`✅ Email sent to ${to}`);
    } catch (error) {
      logger.error(`❌ Error sending email to ${to}: ${error.message}`);
      if (error.response) {
        logger.error(
          `SendGrid Response Error: ${JSON.stringify(error.response.body)}`
        );
      }
      throw new InternalServerError(`Error sending email to ${to}`);
    }
  }

  async sendOtp(userName, email, otp) {
    const subject = EmailTemplates.sendOtp.subject;
    const text = EmailTemplates.sendOtp.text(userName, otp);
    const html = EmailTemplates.sendOtp.html(userName, otp);
    await this.sendMail(email, subject, text, html);
  }

  async sendEnquiryEmail(fullName, email, phone, message) {
    const subject = `New Enquiry from ${fullName}`;
    const text = EmailTemplates.sendEnquiry.text(
      fullName,
      email,
      phone,
      message
    );
    const html = EmailTemplates.sendEnquiry.html(
      fullName,
      email,
      phone,
      message
    );

    await this.sendMail(this.toEmail, subject, text, html);
  }

  async sendAutoReplyToUser(fullName, email) {
    const subject = EmailTemplates.sendAutoReply.subject;
    const text = EmailTemplates.sendAutoReply.text(fullName, email);
    const html = EmailTemplates.sendAutoReply.html(fullName, email);
    await this.sendMail(email, subject, text, html);
  }
}

module.exports = new SendGridService();
