const AWS = require("aws-sdk");
const express = require("express");
const app = express();
const fileUpload = require('express-fileupload');
const cors = require("cors");

app.use(cors());

const { login } = require("./controllers/login");
const { getDocumentsByTableName, uploadDocument } = require("./controllers/documents")

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.json());

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: "https://dynamodb.us-east-2.amazonaws.com",
  region: "us-east-2"
});

const dynaConnection = new AWS.DynamoDB.DocumentClient();


const s3Connection = new AWS.S3();
app.set("dyna", dynaConnection);
app.set("s3", s3Connection);
const apiPath = "/api/v1/topcoder";

app.get(`${apiPath}/health`, (req, res) => {
  res.send("ok");
});

app.post(`${apiPath}/login`, login);

app.get(`${apiPath}/documents/:tableName`, getDocumentsByTableName);
app.get(`${apiPath}/document/:tableName/:irn`);
app.post(`${apiPath}/document/upload/:tableName/:irn`, uploadDocument)

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'))

app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
