const express = require("express");
const router = express.Router();

const DM = (db) => {
    router.get("/api/DM_Message_Data", async (req, res) => {
        const dm = await db
            .collection("DM")
            .find({"_id":"650bd0c38007affc0aa42229"});

        return res.json(dm);
    })
}

module.exports = DM;