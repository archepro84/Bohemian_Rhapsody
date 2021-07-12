const express = require("express");
const router = express.Router();
const Favorites = require("../models"); //mysql은 모델스까지만 호출해도 가능
const Posts = require("../models")
// const authMiddleware = require("../middleware/auth-middleware");

router.get('/api/like', async (req, res) => {
    try {
        const {userId} = res.locals.users; //로컬 스토리지에 있는 userId를 받고

        const favorite = await Favorites.findAll(
            { //userId 를 통해서 10번째 줄부터 mysql db에 조회해서
                where: {
                    userId
                }
            }
        );

        let postId = favorite["postId"]

        const post = await Posts.findOne({where: {
                postId
            }});

        let resultGive = [
            post["postId"], post["img"]
        ]
        res
            .status(200)
            .json({result: resultGive});
    } catch (error) {
        res.status(400).send();
    }

});

module.exports = router