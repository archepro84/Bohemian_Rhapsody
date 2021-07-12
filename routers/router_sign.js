const express = require("express");
const { Users } = require("../models"); //구조분해 할당을 해주어야함. index를 거쳐 users가 호출. index를 거쳐야함! users로 변수선언 해주었기 때문에 users 모델을 가져올 수 있음. 모델에서 반환값이 users
const Joi = require("joi");

const router = express.Router();

const joiSchema = Joi.object({
  nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,20}$")),
  password: Joi.string().min(6).max(30),
  confirmPassword: Joi.string(),
});

// 회원가입 api
router.post("/sign", async (req, res) => {
  try {
    const { nickname, password, confirmPassword } =
      await joiSchema.validateAsync(req.body); //여기 await는 왜 붙었을까?

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return;
    }

    if (password == nickname) {
      res.status(400).send({
        errorMessage: "닉네임과 패스워드는 달라야 합니다.",
      });
      return;
    }

    await Users.create({ nickname, password });

    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "닉네임 또는 비밀번호 형식이 올바르지 않습니다.",
    });
  }
});

// nickname 중복 api
router.post("/sign/nickname", async (req, res) => {
  const { nickname } = req.body;


  const existUsers = await Users.findAll({
    where: { nickname }, // 변수는 변수 한개만 넣어줘도 모든 속성 값에서 찾아줄 수 있다.
  });

  if (existUsers.length) {
    res.send({
      result: "fail",
    });
  } else {
    res.send({
      result: "success",
    });
  }
});

module.exports = router;