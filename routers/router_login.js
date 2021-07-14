const express = require("express");
const {Users} = require("../models"); //models 폴더를 참조하기 위한, ..은 다른 폴더 . 은 같은 폴더
const jwt = require("jsonwebtoken"); // jwt토큰을 사용하기 위한
const Joi = require("joi");
const cors = require("cors");
//joi 라이브러리 참조하기 위한
const router = express.Router();

// router.use(cors())

const postLoginSchema = Joi.object({
    nickname: Joi.string().required(),//닉네임은 문자열인데 필수값이다
    password: Joi.string().required(),//패스워드 또한 문자열이고 필수 값이다
});

router.post("/login", async (req, res) => {

    try {//에러가 날 수 있으니 try catch로 감싸준다
        const {nickname, password} = await postLoginSchema.validateAsync(req.body);
        const userId = await Users.findOne({
            where: {nickname, password}
        })
            .then((user) => {
                return user['dataValues']['userId']
            });
        if (!userId) {//입력한 값이 데이터 베이스에 일치하는 값이 없는 경우
            res.status(401).send({
                errorMessage: '닉네임 또는 패스워드가 잘못되었습니다.'
            });
            return; //여기서 일치하지 않는다면 아래 코드는 실행할 이유가 없으니 return
        }

        const token = jwt.sign({userId}, "Freddie_Mercury");//위에 과정을 통과했다면 토큰 발급
        res.send({userId, token});
    } catch (err) {//에러핸들링
        res.status(401).send({
            errorMessage: "요청한 데이터가 올바르지 않습니다."
        });
    }
});

module.exports = router