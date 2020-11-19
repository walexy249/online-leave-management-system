const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
// -------------------------------------
// This class sends the email to the client email address
// -------------------------------------
module.exports = class Email {
  // accept the userdails , and the object for the ejs template
  constructor(user, data) {
    this.to = user.email;
    this.firstName = user.fullname.split(' ')[0];
    this.from = `Online Leave Management System <federalpolyilaro@gmail.com>`;
    this.data = data;
  }

  newTransport() {
    return nodemailer.createTransport({
      // service: 'gmail',
      // // auth: {
      // //   user: process.env.SENDER_EMAIL,
      // //   pass: process.env.SENDER_PASSWORD
      // // }

      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  // create the email template
  async send(template, subject) {
    const html = await ejs.renderFile(
      path.join(__dirname, '..', 'views', `${template}.ejs`),
      {
        firstName: this.firstName,
        templateData: this.data
      }
    );
    // set the sendMail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
    };
    // send a the email to the client
    await this.newTransport().sendMail(mailOptions, err => {
      if (err) return console.log(err);
      console.log('Email sent successfully');
    });
  }

  // send a approved appointment email
  async approveAppointment() {
    await this.send('approved', 'Leave Appointment Approved');
  }

  // send a declined  appointment email
  async declineAppointment() {
    await this.send('declined', 'Leave Appointment Declined');
  }
};
