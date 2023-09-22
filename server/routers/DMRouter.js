const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

const dmID = "650bd0c38007affc0aa42229";

const DM = (db) => {
    router.get("/api/test", async (req, res) => {
        const date = new Date("2023-09-22T03:30:01.591+00:00");
        const result = await db.collection("DM_Message").find({"Date": date}).toArray();

        return res.json(result);
    })

    router.get("/api/DMdata", async (req, res) => {
        const dm = await db
            .collection("DM_Message")
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

    router.post("/api/sendDM", async (req, res) => {
        const date = new Date(req.body.Date);
        db.collection("DM_Message")
            .insertOne({
                DM_ID: new ObjectId(dmID),
                ...req.body,
                Date: date})
            .then();
    })

    router.delete("/api/deleteDM", async (req, res) => {
        const date = new Date(req.query.date);

        db.collection("DM_Message")
        .deleteOne({Date: date})
        .then();
    })

    return router;
}

module.exports = DM;