// services/email_service.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App Password
    },
});

exports.sendCertificateMail = async ({
    email,
    secondmail,
    subject,
    html,
    pdfBuffer,
}) => {
    const receivers = secondmail
        ? `${secondmail}`
        : email;

       
    await transporter.sendMail({
        from: `"Event Team" <${process.env.MAIL_USER}>`,
        to: receivers,
        subject,
        html,
        attachments: [
            {
                filename: "certificate.pdf",
                content: pdfBuffer,
            },
        ],
    });

    console.log("📧 Mail Sent To:", receivers);
};
