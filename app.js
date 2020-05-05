const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

const port = 4444;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.listen(port, () => {
    console.log('We are live on port 4444');
});




app.get('/', (req, res) => {
    res.send('Welcome to my api');
})

app.post('/api/v1', (req, res) => {
    var data = req.body;

    // create reusable transporter object using the default SMTP transport
    let smtpTransport = nodemailer.createTransport({
        host: 'mail.bytescave.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contact@bytescave.com', // generated ethereal user
            pass: 'Fuck2916$'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // var smtpTransport = nodemailer.createTransport({
    //     host: 'mail.YOURDOMAIN.com',
    //     service: 'privateemail',
    //     port: 465,
    //     auth: {
    //         user: 'contact@bytescave.com',
    //         pass: 'Fuck2916$'
    //     }
    // });

    var mailOptions = {

        from: data.email,
        to: 'ENTER_YOUR_EMAIL',
        subject: 'ENTER_YOUR_SUBJECT',
        html: `<p>${data.firstName}</p>
        <p>${data.lastName}</p>
        <p>${data.companyName}</p>
        <p>${data.email}</p>
          <p>${data.phoneNumber}</p>
          <p>${data.message}</p>`
    };

    smtpTransport.sendMail(mailOptions,
        (error, response) => {
            if (error) {
                res.send(error)
            } else {
                res.send('Success')
            }
            smtpTransport.close();
        });

})