const jwt = require("jsonwebtoken");
const Users = require("../models/users");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization == undefined) {
  }

  const [tokenType, tokenValue] = authorization.split("");

  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요",
    });
  }

  try {
    const { userId } = jwt.verify(tokenValue, "my-secret-key");
  } catch (error) {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요",
    });
    return;
  }
};
