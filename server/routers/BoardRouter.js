const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

const Board = (db) => {
    router.get("/api/getPostList", async (req, res) => {
        const boardType = req.query.type;
        try {
            const postList = await db
                .collection("Post")
                .find({"Type":boardType})
                .sort({ Register_Date: -1 })
                .toArray();

            if(postList) {
                return res.json(postList);
            }
            else return res.status(404).json({ message: "해당 타입의 게시글이 존재하지 않습니다." });
        } catch(e) {
            return res.status(500).json({ message: 'Server Error!!'});
        };
    });

    router.get("/api/getUserPostList", async (req, res) => {
        const id = req.query.id;
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const postsPerPage = 5;
    
        try {
            // 전체 게시물 수를 가져옴
            const totalPosts = await db.collection("Post").countDocuments({ "Register_Id": id });
    
            // 페이징을 위한 오프셋 계산
            const skip = (currentPage - 1) * postsPerPage;
    
            // 해당 페이지에 해당하는 게시물만 가져오도록 수정
            const postList = await db
                .collection("Post")
                .find({ "Register_Id": id })
                .sort({ Register_Date: -1 })
                .skip(skip)
                .limit(postsPerPage)
                .toArray();
    
            if (postList) {
                return res.json({
                    posts: postList.map((post) => ({
                        title: post.Title,
                        date: post.Register_Date
                    })),
                    currentPage: currentPage,
                    totalPages: Math.ceil(totalPosts / postsPerPage),
                });
            } else {
                return res.status(404).json({ message: "해당 유저의 게시글이 존재하지 않습니다." });
            }
        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!' });
        }
    });

    router.delete("/api/deletePosts", async (req, res) => {
        try {
            const boards = req.query.selectedPosts;
            for (const board of boards) {
                const find = await db
                    .collection("Post")
                    .findOne({_id: new ObjectId(board.pk)});

                if(find) {
                    await db
                        .collection("Post")
                        .deleteOne({_id: new ObjectId(board.pk)});
                }
                else return res.status(404).json({ message: "게시판이 존재하지 않습니다."});
            }

            return res.status(200).json({ message: "게시판 삭제 완료"});
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Server Error!!'});
        }
    });

    router.post("/api/posting", async (req, res) => {
        try {
            const nowDate = new Date();

            await db.collection("Post")
                .insertOne({
                    Type: req.body.boardType,
                    Title: req.body.title,
                    Content: req.body.content,
                    Register_Id: req.body.id,
                    Register_Nickname: req.body.nickname,
                    Register_Date: nowDate
                });

            return res.status(200).json({ message: "게시글 올리기 완료" });
        } catch(e) {
            return res.status(500).json({ message: 'Server Error!!'});
        }
    });

    return router;
}

module.exports = Board;