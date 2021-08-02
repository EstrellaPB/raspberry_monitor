'use strict'

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "586cf511671d8b",
        pass: "5814b842b02f5d"
    }
})

function getPasswordResetURL(user, token) {
    return `http://localhost:3000/password-reset/${user._id}/${token}`;
}

function resetPasswordTemplate(user, url) {
    const from = 'Jinn@gmail.com'
    const to = user.email
    const subject = "🌻 Jinn Password Reset 🌻"
    const html = //html 
        `
    <p>Hey ${user.name || user.email},</p>
    <p>We heard that you lost your Jinn password. Sorry about that!</p>
    <p>But don’t worry! You can use the following link to reset your password:</p>
    <a href=${url}>${url}</a>
    <p>If you don’t use this link within 1 hour, it will expire.</p>
    <p>Do something outside today! </p>
    <p>–Your friends at Jinn</p>
    `

    return { from, to, subject, html }
}
module.exports = {
    transporter,
    getPasswordResetURL,
    resetPasswordTemplate
}