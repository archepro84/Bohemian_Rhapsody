const express = require("express");
const {Users, Posts, Favorites, Comments} = require("../models");
const router = express.Router();


router.get('/post/posts', async (req, res) => {
    let result = [];
    await Posts.findAll({})
        .then((posts) => {
            for (const post of posts) {
                result.push({
                        postId: post['dataValues']['postId'],
                        img: post['dataValues']['img']
                    }
                );
            }
        })
    // console.log(result);
    res.send({result})
});

// FIXME 임시 테스트용 이므로 삭제해야함
router.get('/post/postss', async (req, res) => {
    let result = [];
    await Posts.findAll({})
        .then((posts) => {
            for (const post of posts) {
                result.push(post);
            }
        })
    // console.log(result);
    res.send({result})
});

router.post('/post', async (req, res) => {
    //TODO 유저 아이디는 authMiddlewares에서 받아와야한다. 지금은 임시로 삽입
    const userId = 1;
    const {title, artist, showDate, description, img} = req.body
    await Posts.create({userId, title, artist, showDate, description, img})

    res.send()
});

module.exports = router