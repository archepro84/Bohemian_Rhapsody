const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const mysql = require("mysql");

const authMiddleware = require("../middlewares/auth-middleware");
const connection = require("../assets/mySqlLib");

router.get("/comment", async (req, res) => {
  try {
    const { postId } = req.body;

    if (postId == undefined) {
      res.status(412).send({
        errorMessage: "postId를 받아오는데 실패했습니다.",
      });
    }

    const comment_give = `SELECT c.commentId, c.userId, u.nickname, c.comment
    FROM Comments AS c
    JOIN Users AS u
    ON c.userId = u.userId AND c.postId = ${postId}`;

    connection.query(comment_give, function (error, result) {
      res.status(200).send({ result });
    });
  } catch (error) {
    res
      .status(412)
      .send({ errorMessage: "데이터베이스를 조회하는데 실패했습니다." });
    return;
  }
});

router.post("/comment", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user["userId"];
    const { postId, comment } = req.body;

    if (postId == undefined && comment == undefined) {
      res.status(412).send({
        errorMessage: "postId 또는 comment를 받아오는데 실패했습니다.",
      });
    }


    await Comments.create({ userId, postId, comment }).then((result) => {
      let commentId = result["null"];
      res.status(200).send({ commentId });
    });    
  } catch (error) {
    res
      .status(412)
      .send({ errorMessage: "데이터베이스에 저장하는데 실패했습니다." });
    return;
  }
});

router.put("/comment", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user["userId"];
    const { comment, commentId } = req.body;

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
          .send({ errorMessage: "데이터베이스를 수정하는데 실패했습니다." });
        return;
      }
    });
    res.status(200).send();
  } catch (error) {
    res
      .status(412)
      .send({ errorMessage: "데이터베이스를 수정하는데 실패했습니다." });
    return;
  }
});

router.delete("/comment", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.body;

    if (commentId == undefined) {
      res.status(412).send({
        errorMessage: "commentId를 받아오는데 실패했습니다.",
      });
    }

    await Comments.destroy({ where: { commentId } });
    res.status(200).send();
  } catch (error) {
    res
      .status(412)
      .send({ errorMessage: "데이터베이스를 삭제하는데 실패했습니다." });
    return;
  }
});

module.exports = router;
