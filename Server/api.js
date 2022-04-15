const nodemailer = require("nodemailer");
var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const { application } = require("express");
const req = require("express/lib/request");

var connectionString = "mongodb://127.0.0.1:27017";

var app = express();
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/getcustomers", (request, response) => {
  mongoClient.connect(connectionString, (err, clientObj) => {
    if (!err) {
      var dbo = clientObj.db("formsdb");
      dbo
        .collection("userData")
        .find()
        .toArray((err, document) => {
          if (!err) {
            response.send(document);
          }
        });
    }
  });
});

app.post("/registercustomer", (request, response) => {
  mongoClient.connect(connectionString, (err, clientObj) => {
    if (!err) {
      var dbo = clientObj.db("formsdb");
      var data = {
        FirstName: request.body.FirstName,
        LastName: request.body.LastName,
        Email: request.body.Email,
        Mobile: request.body.Mobile,
        Password: request.body.Password,
        ConfirmPassword: request.body.ConfirmPassword,
      };
      dbo.collection("userData").insertOne(data, (err, result) => {
        if (!err) {
          console.log(`Record inserted`);
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "",
              pass: "",
            },
          });
          const mailOptions = {
            from: "amitsulakhe12@gmail.com",
            to: "test@aplswd.com",
            subject: "User is Submitted the data through the form",
            text: `Following is the information for the respective user ${data.FirstName} <br> ${data.LastName}, <br> ${data.Email}, <br> ${data.Mobile}, ${data.Password}, <br> ${data.ConfirmPassword} `,
          };
          transporter.sendMail(mailOptions, () => {
            console.log("Email message sent");
          });
          response.send({
            status: true,
            message: "Customer registerd Succesfully",
          });
        } else {
        }
      });
    }
  });
});

app.listen(3300);
console.log(`Server started:http://127.0.0.1:3300`);
