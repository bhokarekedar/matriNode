const nodemailer = require('nodemailer')

const sendEmail = async options => {
const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: "465",
    // secure: true,
    service:'gmail',
    auth: {
        user: "USER_EMAIL",
        pass: "USER_PASSWORD"
    },
    tls:{rejectUnauthorized:false}
})

const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.message,
    attachments: [
        {
            filename: '.png',
            path: __dirname + '.png',
            cid: '.png'
        }
    ]
}

const info = await transporter.sendMail(message)
console.log('Message sent : %s', info.messageId)
console.log(__dirname)
}
module.exports = sendEmail