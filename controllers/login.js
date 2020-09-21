const login = async (req, res) => {
  const dyna = req.app.get("dyna");
  const { email, password } = req.body;
  try {
    const getInfo = await dyna
      .get({
        TableName: "Users",
        Key: { email }
      })
      .promise();
    if (!getInfo.Item) throw "failed login";
    if (getInfo.Item.password === password) {
      res.status(200).send({
        email: getInfo.Item.email,
        permissions: getInfo.Item.permissions
      });
      return;
    }
    throw "failed login";
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

module.exports = {
  login
};
