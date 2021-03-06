const express = require("express");
const router = express.Router();
const {Comments} = require("../models");
const connection = require("../assets/mySqlLib");
const Joi = require("joi")

const authMiddleware = require("../middlewares/auth-middleware");
const getCommentSchema = Joi.object({
    postId: Joi.number().required(),
    start: Joi.number().required(),
    limit: Joi.number().required().min(1),
})

router.get("/comment", async (req, res) => {
    try {
        const {
            postId,
            start,
            limit
        } = await getCommentSchema.validateAsync(Object.keys(req.query).length ? req.query : req.body);

        if (postId == undefined) {
            res.status(412).send({
                errorMessage: "postId를 받아오는데 실패했습니다.",
            });
        }

        const comment_give = `SELECT c.commentId, c.userId, u.nickname, c.comment
            FROM Comments AS c
            JOIN Users AS u
            ON c.userId = u.userId AND c.postId = ${postId}
            ORDER BY commentId DESC
            LIMIT ${start},${limit}`;

        connection.query(comment_give, function (error, result) {
            if (error) {
                res
                    .status(412)
                    .send({errorMessage: "데이터베이스를 조회하는데 실패했습니다."});
                return;
            }
            res.status(200).send({result});
        });
    } catch (error) {
        if (error) {
            res
                .status(412)
                .send({errorMessage: "입력한 데이터 형식이 일치하지 않습니다."});
            return;
        }

    }
});

router.post("/comment", authMiddleware, async (req, res) => {

    try {
        const userId = res.locals.user["userId"];
        console.log(`comment/write userId: ${userId}`);
        // TODO SQL INJECTION 위험이 없겠지
        const {postId, comment} = req.body;

        if (postId == undefined && comment == undefined) {
            res.status(412).send({
                errorMessage: "postId 또는 comment를 받아오는데 실패했습니다.",
            });
        }

        await Comments.create({userId, postId, comment}).then((result) => {
            let commentId = result["null"];
            res.status(200).send({commentId});
        });
    } catch (error) {
        res
            .status(412)
            .send({errorMessage: "데이터베이스에 저장하는데 실패했습니다."});
        return;
    }
});


router.put("/comment", authMiddleware, async (req, res) => {
    const userId = res.locals.user["userId"];
    const {comment, commentId} = req.body;

    if (comment == undefined && commentId == undefined) {
        res.status(412).send({
            errorMessage: "postId 또는 comment를 받아오는데 실패했습니다.",
        });
    }

    await Comments.update(
        {
            comment: comment,
        },
        {
            where: {
                userId,
                commentId,
            },
        }
    ).then((updateCount) => {
        if (updateCount < 1) {
            // 변경된 데이터가 없을 경우
            res
                .status(400)
                .send({errorMessage: "데이터베이스를 수정하는데 실패했습니다."});
            return;
        }
    });
    res.status(200).send();
});

router.delete("/comment", authMiddleware, async (req, res) => {
    const {commentId} = req.body;
    const {userId} = res.locals.user;

    if (commentId == undefined) {
        res.status(412).send({
            errorMessage: "commentId를 받아오는데 실패했습니다.",
        });
    }

    await Comments.destroy({where: {userId, commentId}})
        .then((deleteCount) => {
            if (deleteCount < 1) {
                // 변경된 데이터가 없을 경우
                res
                    .status(400)
                    .send({errorMessage: "데이터베이스를 수정하는데 실패했습니다."});
                return;
            }
        });

    res.status(200).send();
});

module.exports = router;
