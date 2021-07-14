const express = require("express");
const router = express.Router();
const {Favorites} = require("../models"); //mysql은 모델스까지만 호출해도 가능
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/like", authMiddleware, async (req, res) => {
    try {
        let {userId} = res.locals.user;

        let Favorites_receive = await Favorites.findAll({
            attributes: ["postId"],
            where: {userId},
        });

        let favorites = JSON.stringify(Favorites_receive);

        res.status(200).json({result: Favorites_receive[0]});
    } catch (error) {
        // console.log("erro:", error);
        res
            .status(412)
            .send({errorMessage: "데이터베이스를 조회하는데 실패했습니다."});
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
