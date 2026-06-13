const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jainwarkirti8@gmail.com',
        pass: 'gpaq fwff ztuu yfpq'
    }
});

async function sendEmail(to, subject, text) {
    try {
        await transporter.sendMail({
            from: 'FoodSave <yourgmail@gmail.com>',
            to,
            subject,
            text
        });
        console.log('Email Sent');
    } catch (error) {
        console.log(error);
    }
}
module.exports = sendEmail;
