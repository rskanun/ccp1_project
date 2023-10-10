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

        return res.status(200).json({ message: "메시지 전송 완료" });
    })

    router.delete("/api/deleteDM", async (req, res) => {
        const date = new Date(req.query.date);
        await db.collection("Message")
        .deleteOne({Date: date});
        
        return res.status(200).json({ message: "메시지 삭제 완료" });
    })

    router.delete("/api/exitDM", async (req, res) => {
        try {
            const dmID = new ObjectId(req.query.dmID);
            const userID = req.query.userID;

            const dm = await db.collection("DM").findOne({ DM_ID: dmID, User_ID: userID });
            if (dm) {
                await db.collection("DM")
                    .deleteOne({DM_ID: dmID, User_ID: userID});

                return res.status(200).json({ message: "DM 나가기 완료"});
            }
            else return res.status(404).json({ message: "데이터가 존재하지 않습니다." });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Server Error!!'});
        }
    })

    return router;
}

module.exports = DM;