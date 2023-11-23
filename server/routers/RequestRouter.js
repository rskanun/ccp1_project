const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

const Request = (db) => {
    router.post("/api/addRequest", async (req, res) => {
        const { postID, client } = req.body;
        try {
            await db.collection("Request")
                .insertOne({
                    Post_Id: new ObjectId(postID),
                    Client: client,
                    Receiver: "",
                    Status: "모집 중"
                });

            return res.status(200).json({ message: "외주 올리기 완료" });
        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!' });
        }
    })

    router.get("/api/getRequest", async (req, res) => {
        const { postID } = req.query;
        try {
            const request = await db
                .collection("Request")
                .findOne({ Post_Id: new ObjectId(postID) });

            if (request) {
                return res.json(request);
            }
            else return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!' });
        }
    })

    router.get("/api/getFinishedRequest", async (req, res) => {
        const userID = req.query.id;
        const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) : 1;
        const requestsPerPage = 5;

        try {
            // 전체 게시물 수를 가져옴
            const totalRequests = await db
                .collection("Request")
                .countDocuments({ 
                    "Receiver": userID,
                    "Status": "의뢰 완료"
                });

            // 페이징을 위한 오프셋 계산
            const skip = (currentPage - 1) * requestsPerPage;

            const requestList = await db
                .collection("Request")
                .find({ 
                    Receiver: userID,
                    Status: "의뢰 완료"
                })
                .skip(skip)
                .limit(requestsPerPage)
                .toArray();

            if (requestList) {
                return res.json({
                    requests: requestList.map((request) => ({
                        postPk: request.Post_Id,
                        client: request.Client
                    })),
                    totalPages: Math.ceil(totalRequests / requestsPerPage)
                });
            }
            else return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!' });
        }
    })

    return router;
}

module.exports = Request;