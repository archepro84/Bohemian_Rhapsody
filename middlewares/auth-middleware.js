const jwt = require("jsonwebtoken");
const {Users} = require("../models");
const Joi = require("joi")
require('dotenv').config();


module.exports = async (req, res, next) => {
    const {authorization} = req.headers;
    if (authorization == undefined) {
        // 헤더에 토큰이 없을 경우
        res.status(401).send();
        return;
    }
    try {
        const [tokenType, tokenValue] = authorization.split(" ");
        if (tokenType !== "Bearer") {
            // 헤더의 토큰 형식이 다른 경우
            res.status(401).send();
            return;
        }

        const {userId} = jwt.verify(tokenValue, process.env.SECRET_KEY);
        await Users.findByPk(userId)
            .then((user) => {
                res.locals.user = user['dataValues']
            })
        next();
    } catch (error) {
        // 토큰의 인증이 실패한 경우
        res.status(401).send();
        return;
    }
};
