const express = require("express");
const router = express.Router();

const User = (db) => {
    router.get("/api/getUserInfo", async (req, res) => {
        try {
            const user = await db
            .collection("User")
            .findOne({"User_ID": req.body.userID});

            return res.json(user);
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Server Error!!'});
        }
    });

    return router;
}

module.exports = User;