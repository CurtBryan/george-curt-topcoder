const fs = require("fs");
const fsPromises = fs.promises;

const getDocumentsByTableName = async (req, res) => {
  const dyna = req.app.get("dyna");
  const tableName =
    (await req.params.tableName.charAt(0).toUpperCase()) +
    req.params.tableName.slice(1);
  try {
    const getInfo = await dyna
      .scan({
        TableName: tableName,
      })
      .promise();
    if (!getInfo.Items) throw "empty table";
    if (getInfo.Items) {
      res.status(200).send(getInfo);
      return;
    }
    throw "failed login";
  } catch (err) {
    res.status(500).send(err.toString());
  }
  res.send("ok");
};

const uploadDocument = async (req, res) => {
  const dyna = req.app.get("dyna");
  const s3 = req.app.get("s3");
  const { tableName, irn } = req.params;
  try {
    // console.log("started");
    // await fsPromises.writeFile('new.pdf', req.files.file.data);
    // console.log("next")
    // const params = {
    //   Bucket: "uopx-topcoder-cb3",
    //   Body: fs.createReadStream("./new.pdf"),
    //   Key: "folder/" + Date.now() + "_" + req.files.file.name,
    // };
    // console.log(fs.createReadStream("./new.pdf"))
    // const sendToS3 = await s3.upload(params).promise();
    // console.log(sendToS3);
    const sendToDyna = await dyna
      .put({
        TableName: tableName,
        Item: {
          ID: Date.now(),
          formData: {
            documentType: tableName,
            fileName: Date.now() + "_" + req.files.file.name,
            IRN: irn,
          },
        },
      })
      .promise();
    console.log(sendToDyna);
    res.status(200).send(sendToDyna)
  } catch (err) {
    console.log("here");
    res.status(500).send(err);
  }
};

const getAllDocsInTable = async (tableName, dyna) => {
  try {
    const getInfo = await dyna
      .scan({
        TableName: tableName,
      })
      .promise();
    if (!getInfo.Items) throw "empty table";
    if (getInfo.Items) {
      return getInfo;
    }
    throw "failed pull";
  } catch (err) {
    return "ERROR:" + err.toString();
  }
};

module.exports = {
  getDocumentsByTableName,
  uploadDocument,
};
