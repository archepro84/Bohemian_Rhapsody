const express = require("express");
const {Users, Posts} = require("../models")
const {Op} = require("sequelize");
const router = express.Router();


router.get('/search', async (req, res) => {
    const {keyword} = req.query
    if (keyword == undefined) {
        res.status(412).send()
        return;
    }
    // TODO 해킹 방지를 위해 특수문자를 넣으면안된다.는 예외 추가할 수도 있음

    let result = Array()
    await Posts.findAll({
        where: {
            title: {
                [Op.like]: `%${keyword}%`
            },
        },
    })
        .then((posts) => {
            for (const Posts of posts) {
                //result 어레이 맨 뒤에 데이터를 넣는다.
                result.push(
                    // 형식 맞추기위해 중괄호 사용
                    {
                        postId: Posts['dataValues']['postId'],
                        img: Posts['dataValues']['img']
                    }
                )
            }
            res.send(result)
        })

})

module.exports = router