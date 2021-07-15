const express = require("express");
const router = express.Router();
const {Favorites} = require("../models"); //mysql은 모델스까지만 호출해도 가능
const authMiddleware = require("../middlewares/auth-middleware");
const Joi = require("joi")
const connection = require("../assets/mySqlLib")

const limitSchema = Joi.object({
    start: Joi.number().required(),
    limit: Joi.number().required().min(1),
})
const userIdSchema = Joi.number().required();

router.get('/like', authMiddleware, async (req, res) => {
    try {
        let result = []
        const userId = await userIdSchema.validateAsync(Object.keys(res.locals).length ? res.locals.user.userId : 0)
        const {start, limit} = await limitSchema.validateAsync(Object.keys(req.query).length ? req.query : req.body)
        const query = `SELECT postId, img
        FROM Posts
        WHERE postId IN (SELECT postId FROM Favorites WHERE userId = ${userId})
        LIMIT ${start}, ${limit};`
        connection.query(query, function (error, posts) {
            if (error) {
                res.status(412).send({
                    errorMessage: "Favorites 테이블을 검색하지 못했습니다."
                })
                return;
            }
            for (const post of posts) {
                result.push(
                    {
                        postId: post.postId,
                        img: post.img,
                    }
                )
            }
            res.send({result: result})
        });
    } catch (error) {
        res.status(412).send({
            errorMessage: "입력한 데이터 형식이 일치하지 않습니다."
        })
        return;
    }

});

router.post("/like", authMiddleware, async (req, res) => {
    try {
        let userId = res.locals.user["userId"];
        let {postId} = req.body;
        await Favorites.findOne({
            where: {userId, postId}
        }).then((result) => {
            if (result) {
                console.log(result);
                res.status(412).send(
                    {
                        errorMessage: "이미 즐겨찾기에 추가된 게시글 입니다."
                    }
                );
            }
            return;
        })

        await Favorites.create({userId, postId});
        res.status(200).send();
    } catch (error) {
        //해당하는 포스트가 없을때
        res.status(412).send();
    }
});

router.delete("/like", authMiddleware, async (req, res) => {
    try {
        const {userId} = res.locals.user
        const {postId} = req.body;

        if (postId == undefined) {
            res.status(412).send({
                errorMessage: "postId를 받아오는데 실패했습니다.",
            });
        }

        await Favorites.destroy({where: {userId, postId}});
        res.status(200).send();
    } catch (error) {
        res
            .status(412)
            .send({errorMessage: "데이터베이스를 삭제하는데 실패했습니다."});
        return;
    }
});


module.exports = router;
