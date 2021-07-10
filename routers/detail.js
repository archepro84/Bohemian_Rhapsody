const express = require("express");
const {Users, Posts, Favorites, Comments} = require("../models");
const router = express.Router();


// router.get('/post/posts', async (req, res) => {
//     let result = [];
//     await Posts.findAll({})
//         .then((posts) => {
//             for (const post of posts) {
//                 result.push({
//                         postId: post['dataValues']['postId'],
//                         img: post['dataValues']['img']
//                     }
//                 );
//             }
//             res.send({result})
//         })
// });

router.get('/:postId', async (req, res) => {
    const {postId} = req.params
    await Posts.findByPk(postId)
        .then((post) => {
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
});

module.exports = router