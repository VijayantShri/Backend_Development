/**
 * This file will have the logic to send emails.
 */

const nodemailer = require("nodemailer");

/**
 * I need to setup the nodemailer for send the emails.
 * smtp host details
 * credentials if needed.
 */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "", // <valid email Id>
        pass: "" // <Valid Password>
    },
    secure: true
});

transporter.verify().then(console.log).catch(console.error);
/**
 * Transporter will be used to send the emails.
 */

const mailDataObj = {
    from: "contacts@vijayantshri.com",
    to: "vijayantshrivastav@gmail.com",
    subject: "Very imp message",
    text: "There is nothing important than time in life."
};

transporter.sendMail(mailDataObj, (err, info) => {
    if (err) {
        console.log("Send email error: ", err);
    } else {
        console.log(info);
    }
});