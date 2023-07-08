const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: process.env['MAILGUN_API_KEY'], domain: process.env['MAILGUN_DOMAIN']});


exports.sendEmail = function sendEmail(to, subject, text) {

    const data = {
        from: 'My Study Life <no-reply@mystudylife.test>',
        to: to,
        subject: subject,
        html: text
    };

    mg.messages().send(data, function (error, body) {
        console.log(body);
    });

}