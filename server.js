const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gundashivakumar11@gmail.com', // Sender/Receiver Email
        pass: 'qvca emry uwxq ivvo' // App Password provided by User
    }
});

// Verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log("Server verification error:", error);
    } else {
        console.log("Server is ready to send messages");
    }
});

// Contact Form Route
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please fill out all fields.' });
    }

    const mailOptions = {
        from: `"${name}" <${email}>`, // User's email as from
        to: 'gundashivakumar11@gmail.com', // Receiver Email
        replyTo: email,
        subject: `[Portfolio Contact] New Message from ${name}`,
        text: `You have received a new message from your portfolio website.\n\nSender Details:\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <br>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
