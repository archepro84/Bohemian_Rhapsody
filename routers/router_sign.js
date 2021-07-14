const express = require("express");
const {Users} = require("../models"); //구조분해 할당을 해주어야함. index를 거쳐 users가 호출. index를 거쳐야함! users로 변수선언 해주었기 때문에 users 모델을 가져올 수 있음. 모델에서 반환값이 users
const Joi = require("joi");
const cors = require("cors");

const router = express.Router();

// router.use(cors())

const joiSchema = Joi.object({
    nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,20}$")).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
    confirmPassword: Joi.string().required(),
});

// 회원가입 api
router.post("/sign", async (req, res) => {
    try {
        const {nickname, password, confirmPassword} =
            await joiSchema.validateAsync(req.body); //여기 await는 왜 붙었을까?

        if (password !== confirmPassword) {
            res.status(412).send(
                {
                    errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
                }
            );
            return;
        }
        if (password == nickname) {
            res.status(412).send(
                {
                    errorMessage: "닉네임과 패스워드는 달라야 합니다.",
                }
            );
            return;
        }
        await Users.create({nickname, password});

        res.send();
    } catch (err) {
        console.log(err);
        res.status(412).send({
            // TODO 중복된 닉네임을 사용해서 로그인 하였을 경우도 발생한다.
            errorMessage: "닉네임 또는 비밀번호 형식이 올바르지 않습니다.",
        });
    }
});

const nicknameSchema = Joi.object({
    nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,20}$")).required()
})

// nickname 중복 api
router.post("/sign/nickname", async (req, res) => {
    const {nickname} = await nicknameSchema.validateAsync(req.body);

    const existUsers = await Users.findAll({
        where: {nickname}, // 변수는 변수 한개만 넣어줘도 모든 속성 값에서 찾아줄 수 있다.
    });

    if (existUsers.length) {
        res.status(406).send();
        return;
    } else {
        res.send();
        return;
    }
});

module.exports = router;