const express = require("express");
const {Users, Posts, Favorites, Comments} = require("../models");
const router = express.Router();
const Joi = require("joi");

const postIdSearchSchema = Joi.object({
    postId: Joi.number().required()
});
router.get('/:postId', async (req, res) => {
    try {
        const {postId} = await postIdSearchSchema.validateAsync(req.params)

        await Posts.findByPk(postId)
            .then((post) => {
                if (post == null) {
                    //위에서 findByPk 값을 찾을 수 없기 때문에 에러가 발생
                    res.status(404).send()
                    return;
                }
                const result = {
                    postId: post.postId,
                    title: post.title,
                    artist: post.artist,
                    showDate: post.showDate,
                    description: post.description,
                    img: post.img,
                }
                res.send(result)
            })
    } catch (error) {
        res.status(412).send()
        return;
    }
});

module.exports = router