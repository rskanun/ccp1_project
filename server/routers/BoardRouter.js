const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

const Board = (db) => {
    router.get("/api/getPostList", async (req, res) => {
        const boardType = req.query.type;
        try {
            const boardList = await db
                .collection("Post")
                .find({"Type":boardType})
                .sort({ Register_Date: -1 })
                .toArray();

            if(boardList) {
                return res.json(boardList);
            }
            else return res.status(404).json({ message: "해당 타입의 게시글이 존재하지 않습니다." });
        } catch(e) {
            return res.status(500).json({ message: 'Server Error!!'});
        };
    });

    router.delete("/api/deletePosts", async (req, res) => {
        try {
            const boards = req.query.selectedBoards;
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