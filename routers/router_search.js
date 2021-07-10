const express = require("express");
const {Users, Posts} = require("../models")
const {Op} = require("sequelize");
const router = express.Router();


router.get('/search', async (req, res) => {
    const {keyword} = req.query
    let result = Array()
    await Posts.findAll({
        where: {
            title: {
                [Op.like]: `%${keyword}%`
            },
        },
    })
        .then((posts) => {
            for (const post of posts) {
                result.push(
                    {
                        postId: post['dataValues']['postId'],
                        img: post['dataValues']['img']
                    }
                )
            }
            res.send(result)
        })

})

module.exports = router