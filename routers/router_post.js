const express = require("express");
const {Users, Posts, Favorites, Comments} = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const Joi = require("joi");


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
    res.send({result})
});
const postSchema = Joi.object({
    title: Joi.string().required(),
    artist: Joi.string(),
    showDate: Joi.date(),
    description: Joi.string(),
    img: Joi.string()

});

router.post('/post', authMiddleware, async (req, res) => {
    const userId = res.locals.user['userId']
    if (userId == undefined) {
        res.status(412).send()
        return;
    }
    try {
        const {title, artist, showDate, description, img} = await postSchema.validateAsync(req.body);
        await Posts.create({userId, title, artist, showDate, description, img})
        res.send()
    } catch (error) {
        res.status(412).send()
        return;
    }
});

const postIdSchema = Joi.object({
    postId: Joi.number().required()
})
router.put('/post/:postId', authMiddleware, async (req, res) => {
    try {
        const {userId} = res.locals.user
        const {postId} = await postIdSchema.validateAsync(req.params)
        const {title, artist, showDate, description, img} = await postSchema.validateAsync(req.body)

        //update의 반환값은 튜플이 몇개 변경되었는지 나타내는 수
        await Posts.update(
            {title, artist, showDate, description, img},
            {
                where: {postId, userId}
            }
        )
            .then((updateCount) => {
                // userId가 틀렸거나,
                // postId가 틀렸거나,
                // post 존재하지않거나
                if (updateCount < 1) {
                    // 변경된 데이터가 없을 경우
                    res.status(400).send()
                    return;
                }
            })
        res.send()
    } catch (error) {
        res.status(412).send()
        return;
    }
});

module.exports = router