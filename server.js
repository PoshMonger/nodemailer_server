const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require('dotenv').config();


// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(process.env.PORT || 5000);



const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })


async function buildMailServer() {

  const accessToken = await oAuth2Client.getAccessToken()
  const contactEmail = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      type: 'OAuth2',
      user: 'process.env.username',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
  });


router.get('/',(req,res)=>{

  
res.send('hey its working')
})
  router.post("/contact", (req, res) => {

    const name = req.body.firstName + req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;
    const mail = {
      from: name,
      to: "process.env.username",
      subject: "Contact Form Submission - Portfolio",
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Phone: ${phone}</p>
             <p>Message: ${message}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json(error);
      } else {
        res.json({ code: 200, status: "Message Sent" });
      }
    });
  });


}

buildMailServer()
