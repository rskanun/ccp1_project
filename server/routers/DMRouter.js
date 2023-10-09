const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

const DM = (db) => {
    router.get("/api/getDMList", async (req, res) => {
        const userID = req.query.userID;
        const dmList = await db
            .collection("DM")
            .find({"User_ID": userID})
            .toArray();

        // 필요한 정보만 따로 가져와 리스트로 변환
        const result = dmList.map((data) => ({
            id: data.DM_ID,
            name: data.Name
        }));

        return res.json(result);
    })

    router.get("/api/DMdata", async (req, res) => {
        const dmID = req.query.dmID;
        const dm = await db
            .collection("Message")
            .find({"DM_ID": new ObjectId(dmID)})
            .toArray();

        // 데이터 값 DM에 적용할 수 있도록 변환
        const messageList = dm.map((msg) => ({
            text: msg.Content,
            sender: msg.Sender,
            date: msg.Date
        }));

        return res.json(messageList);
    })

    router.get("/api/getUserList", async (req, res) => {
        const dmID = req.query.dmID;
        const userList = await db
            .collection("DM")
            .find({"DM_ID": new ObjectId(dmID)})
            .project({"User_ID":1})
            .toArray();

        return res.json(userList.map(user => user.User_ID));
    })

    router.post("/api/sendDM", async (req, res) => {
        const date = new Date(req.body.Date);
        const dmID = new ObjectId(req.body.DM_ID);
        await db.collection("Message")
            .insertOne({
                ...req.body,
                DM_ID: dmID,
                Date: date});

        res.status(200).json({ message: "메시지 전송 완료" });
    })

    router.delete("/api/deleteDM", async (req, res) => {
        const date = new Date(req.query.date);
        await db.collection("Message")
        .deleteOne({Date: date});
        
        res.status(200).json({ message: "메시지 삭제 완료" });
    })

    return router;
}

module.exports = DM;