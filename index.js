require("dotenv").config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const { getMaxListeners } = require("process");

const app = express();
const port = process.env.PORT || 3000;

var user_email = null;
var authorized = false;


app.use(express.static(path.join(__dirname, "")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});


app.get("/login", (req, res) => {
    res.sendFile("/public/user_login.html");
});

app.get("/email_form", (req, res) => {
    if(authorized){
        authorized = false;
        user_email = null;
        
        res.sendFile("/public/email_form.html");
    } 
});


app.post("/email_form", (req, res) => {

    let mailOptions = {
        from: user_email,
        to: req.body.email,
        subject: req.body.subject,
        text: req.body.text
    };
    
    transporter.sendMail(mailOptions, function(err, data) {
        if(err) {
            res.send({
                success: -1,
                message: `Email failed.`
            });
        } else {
            res.send({
                success: 1,
                message: `Email sent successfully to ${mailOptions.to}`
            });
        }
    });
});

app.post("/login", (req, res) => {

    // If email and password provided match to user's credentials
    if(req.body.email == process.env.MAIL_USERNAME && req.body.password == process.env.MAIL_PASSWORD){
        console.log("Valid");
        user_email = req.body.email;
        authorized = true;
        res.send({
            success: 1,
            message: "email_form"   // Redirect page
        });

    } 
    // If email provided is incorrect
    else if(req.body.email != process.env.MAIL_USERNAME && req.body.password == process.env.MAIL_PASSWORD){
        authorized
        res.send({
            success: -1,
            message: `Email ${req.body.email} is incorrect.`
        });

    } 
    // If password provided is incorrect
    else if(req.body.password != process.env.MAIL_PASSWORD && req.body.email == process.env.MAIL_USERNAME){
        res.send({
            success: -1,
            message: "Password is incorrect."
        });

    } 
    // If both email and password provided are incorrect
    else {
        res.send({
            success: -1,
            message: `Email and password are incorrect.`
        });
    }
    
});

app.listen(port, () => {
    console.log(`Local server is listening to port ${port}`);
})