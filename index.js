const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const cors = require("cors");
var nodemailer = require('nodemailer');

const app = express();
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 8080;

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function welcome(agent) {
        console.log(`intent  =>  welcome`);
        agent.add("Welcome to our cow selling company....Enter your Name")
    }
    
    function email(agent) {
       
        const {person, address, email, phone, age, budget, type} = agent.parameters;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mkashan2585@gmail.com',
              pass: 'tezkkcusndyodjsr'
            }
          });
        agent.add("Email send successfully....")
        var mailOptions = {
            from: 'mkashan2585@gmail.com',
            to: `${email}, hammadn788@gmail.com`,
            subject: 'Cow Purchasing Information',
            html: `
            <!DOCTYPE html>
            <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 100px;
        }
        .content {
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .purchase-details {
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .purchase-details h2 {
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Your Purchase, ${person.name}!</h1>
        </div>
        <div class="content">
            <p>Dear ${person.name},</p>
            <p>Thank you for purchasing a cow from our farm. Below are the details of your purchase:</p>
            <div class="purchase-details">
                <h2>Purchase Details</h2>
                <p><strong>Breed:</strong> ${type}</p>
                <p><strong>Age:</strong> ${age} </p>
                <p><strong>Price:</strong> ${budget}</p>
                <p><strong>Delivery Address:</strong> ${address}</p>
                <p><strong>Email Address:</strong> ${email}</p>
                <p><strong>Contact Number:</strong> ${phone}</p>
            </div>
            <p>We will contact you soon to confirm the delivery details.</p>
            <p>Thank you for choosing our farm for your purchase. We hope to serve you again in the future.</p>
            <p>Best regards,<br>Cows Selling Company</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Cows Selling Company. All rights reserved.</p>
            <p>1234 Farm Road, Townsville, Country</p>
            <p><a href="mailto:support@yourcompany.com">support@yourcompany.com</a> | <a href="tel:+1234567890">+123 456 7890</a></p>
        </div>
    </div>
</body>
</html>`
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
          console.log(`intent  =>  email`);
        }
    
    

   

    let intentMap = new Map(); 
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('cow-info', email); 
    
    agent.handleRequest(intentMap);
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});