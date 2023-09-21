const express = require("express");
const router = express.Router();

const DM = (db) => {
    router.get("/api/DM_Message_Data", async (req, res) => {
        const messageList = await db
            .collection("DM_Message")
            .find({"_id":""})
    })
}

module.exports = DM;