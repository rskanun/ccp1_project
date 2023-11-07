const express = require("express");
const router = express.Router();

const User = (db) => {
    router.get("/api/getUserInfo", async (req, res) => {
        const id = req.query.userID;

        try {
            if(id) {
                const user = await db
                    .collection("User")
                    .findOne({"ID": id});

                if(user) return res.json(user);
                else return res.status(404).json({ message: '아이디를 찾지 못했습니다!' });
            }
            else {
                return res.status(404).json({ message: '아이디가 없습니다!' });
            }
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Server Error!!'});
        }
    });

    return router;
}

module.exports = User;