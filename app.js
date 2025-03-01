const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
const cors = require("cors");

const app = express();

const port = 4444;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// app.listen(port, () => {
//   console.log("We are live on port", port);
// });

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.get("/", (req, res) => {
    res.send("Welcome to my api");
});

app.post("/api/v2", async (req, res) => {
    console.log("/api/v2 begins");
    const data = req.body;
    console.log(data)
    const auth = {
        auth: {
            api_key: "", //api key of the mail sender
            domain: "" // domain of the mail sender
        },
    };

    const transporter = nodemailer.createTransport(mailGun(auth));

    const mailOptions = {
        from: data.email,
        to: "email@email.com",
        subject: "Test email - Subject",
        text: "I would like to get in touch with you!",
        html: `
        <h3>This is a test email</h3>
        <p>${data.firstName}</p>
        <p>${data.lastName}</p>
        <p>${data.companyName}</p>
        <p>${data.email}</p>
        <p>${data.phoneNumber}</p>
        <p>${data.message}</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log("Message did not send, %s", error);
            res.send(error);
        } else {
            console.log("Message sent: %s", response);
            res.send("Success");
        }
    });
});

app.post("/api/v1", async (req, res) => {
    console.log("/api/v1 begins")
    var data = req.body;
    console.log(data)

    //   create reusable transporter object using the default SMTP transport
    let smtpTransport = nodemailer.createTransport({
        // name: "www.bytescave.com",
        host: "smtp.google.com", 
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "email@email.com", // generated ethereal user
            pass: "******", // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Verify connection configuration
    await smtpTransport.verify(function (error, success) {
        if (error) {
            console.log("Server is NOT ready to take our messages");
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    var mailOptions = {
        from: "email@email.com", //The user email
        to: "email@email.com", //The email where you want to receive email
        subject: "Test Subject",
        text: "Hello world?",
        html: `<p>${data.firstName}</p>
          <p>${data.lastName}</p>
          <p>${data.companyName}</p>
          <p>${data.email}</p>
            <p>${data.phoneNumber}</p>
            <p>${data.message}</p>`,
    };

    await smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log("Message did not send, %s", error);
            res.send(error);
        } else {
            console.log("Message sent: %s", response);
            res.send("Success");
        }
        smtpTransport.close();
    });
});
