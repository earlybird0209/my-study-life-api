const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env['SENDGRID_API_KEY']);

exports.sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: 'no-reply@mystudylife.test', // Use the email address you verified with SendGrid
    subject,
    html: text,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
