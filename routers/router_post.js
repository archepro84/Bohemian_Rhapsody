const express = require("express");
const {Users, Posts, Favorites, Comments} = require("../models");
const db = require("../models").db;

const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const authMiddlewareAll = require("../middlewares/auth-middleware_all")
const Joi = require("joi");
const cors = require("cors");
const connection = require("../assets/mySqlLib")


// router.use(cors())

const postSchema = Joi.object({
    title: Joi.string().required(),
    artist: Joi.string(),
    showDate: Joi.date(),
    description: Joi.string(),
    img: Joi.string()

});

const postIdSchema = Joi.object({
    postId: Joi.number().required()
})
const userIdSchema = Joi.number().required()

router.get('/post/posts', authMiddlewareAll, async (req, res) => {
    let result = [];
    try {
        const userId = await userIdSchema.validateAsync(Object.keys(res.locals).length ? res.locals.user.userId : 0)

        //FIXME query를 mysql 모듈로 사용하지 않고 ORM을 사용하도록 수정하자
        const query = `select postId, img, 
        case when postId in (select postId from Favorites where userId = ${userId}) then "TRUE" else "FALSE" end as favorite
        from Posts;`;
        await connection.query(query, function (error, posts, fields) {
            if (error) {
                console.error(error);
                res.status(400).send({
                        errorMessage: "Posts 값들이 존재하지 않습니다."
                    }
                )
                return;
            }
            for (const post of posts) {
                result.push({
                    postId: post.postId,
                    img: post.img,
                    favorite: post.favorite,
                })
            }
            res.send({result})
        });
    } catch (error) {
        res.status(412).send(
            {
                errorMessage: "입력받은 데이터 형식이 일치하지 않습니다."
            }
        )
    }


    // await Posts.findAll({})
    //     .then((posts) => {
    //         for (const post of posts) {
    //             result.push({
    //                     postId: post['dataValues']['postId'],
    //                     img: post['dataValues']['img']
    //                 }
    //             );
    //         }
    //     })
    // res.send({result})
});

// router.get('/post/postss', authMiddleware, async (req, res) => {
//     const {userId} = res.locals.user
//     const result = await db.query("SELECT * FROM Posts", function (err, result) {
//         done();
//         if (err) {
//             throw err;
//         }
//     })
//
//     console.log(result);
//     res.send({result})
// });


router.post('/post', authMiddleware, async (req, res) => {
    const userId = res.locals.user['userId']
    if (userId == undefined) {
        res.status(412).send()
        return;
    }
    try {
        const {title, artist, showDate, description, img} = await postSchema.validateAsync(req.body);

        // TODO Create 에서 반환되는 post의 null이 과연 정상적인 postId값인가?
        await Posts.create({userId, title, artist, showDate, description, img})
            .then((post) => {
                // console.log(post['null']);
                const postId = post['null'];
                res.send({postId})
            })

    } catch (error) {
        res.status(412).send()
        return;
    }
});


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

router.delete('/post', authMiddleware, async (req, res) => {
    try {
        const {userId} = res.locals.user
        const {postId} = await postIdSchema.validateAsync(req.body)
        await Posts.destroy({
            where: {
                postId, userId
            }
        })
            .then((deleteCount) => {
                if (deleteCount < 1) {
                    res.status(400).send({
                        errorMessage: "데이터가 삭제되지 않았습니다."
                    })
                    return;
                }
            })
        res.send()
        return;
    } catch (error) {
        res.status(412).send()
        return;
    }
});


module.exports = router