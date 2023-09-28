const express = require("express");
const router = express.Router();

const login = (db) => {
    router.get("/api/IsAccountExists", async (req, res) => {
        const loginID = req.query.id
        const loginPW = req.query.pw

        const count = await db
            .collection("User")
            .countDocuments({"ID": loginID, "Password": loginPW});
        
        if(count === 0) return res.json({ exists: false });
        else return res.json({ exists: true });
    })

    return router;
}

module.exports = login;