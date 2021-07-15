const express = require("express");
const {Users, Posts, Favorites, Comments} = require("../models");
const router = express.Router();
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middleware")
const authMiddlewareAll = require("../middlewares/auth-middleware_all")
const connection = require("../assets/mySqlLib")


const postIdSearchSchema = Joi.object({
    postId: Joi.number().required()
});
// TODO userId를 굳이 Joi를 써야하나? / Query문의 안전성을 위해 사용한다.
// TODO 만약 토큰키값이 유출돼 userId가 다른형식으로도 들어올 수 있다는 상황을 가정한다.
// TODO 그러면 authMiddleware에서 Joi를 사용해서 검사하면되지 않을까?
const userIdSchema = Joi.number().required()

router.get('/:postId', authMiddlewareAll, async (req, res) => {
    try {
        const {postId} = await postIdSearchSchema.validateAsync(req.params)
        const userId = await userIdSchema.validateAsync(Object.keys(res.locals).length ? res.locals.user.userId : 0)

        const query = `
        SELECT p.postId, p.userId, u.nickname, p.title, p.artist, p.showDate, p.description, p.img, 
            CASE when p.postId IN (SELECT postId FROM Favorites where userId = ${userId}) then "TRUE" else "FALSE" end as favorite
            FROM Posts AS p
            JOIN Users AS u
            on p.userId = u.userId and p.postId = ${postId};
        `
        await connection.query(query, function (error, post, fields) {
            if (error) {
                res.status(400).send({
                    errorMessage: "데이터검색이 실패했습니다."
                })
                return;
            }
            res.send(
                {
                    postId: post[0].postId,
                    userId: post[0].userId,
                    title:post[0].title,
                    nickname: post[0].nickname,
                    artist: post[0].artist,
                    showDate: post[0].showDate,
                    description: post[0].description,
                    img: post[0].img,
                    favorite: post[0].favorite,
                }
            )
        })
    } catch (error) {
        console.log(error);
        res.status(412).send(
            {
                errorMessage:"입력한 데이터 형식이 일치하지 않습니다."
            }
        )
        return;
    }
});

module.exports = router