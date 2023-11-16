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
                else return res.status(404).json({ message: '해당 아이디를 가진 유저를 찾지 못했습니다!' });
            }
            else {
                return res.status(404).json({ message: '아이디가 없습니다!' });
            }
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Server Error!!'});
        }
    });
    
    router.get("/api/checkInvalidID", async (req, res) => {
        const id = req.query.id;
        const isInvalid = await db
            .collection("User")
            .findOne({"ID": id});

        if(!isInvalid) res.status(200).json({ message: "유효한 아이디입니다."});
        else res.status(401).json({ message: "유효하지 않은 아이디입니다!"});
    });

    router.get("/api/checkInvalidNickname", async (req, res) => {
        const nickname = req.query.nickname;
        const isInvalid = await db
            .collection("User")
            .findOne({"Nickname": nickname});

        if(!isInvalid) res.status(200).json({ message: "유효한 닉네임입니다."});
        else res.status(401).json({ message: "유효하지 않은 닉네임입니다!"});
    });

    router.post("/api/registerUser", async (req, res) => {
        const {id, email, password, nickname} = req.body;

        try {
            await db.collection("User")
                .insertOne({
                    "ID": id,
                    "Password": password,
                    "Nickname": nickname,
                    "Email": email,
                    "Permission_Level": 0
                });

            res.status(201).json({ message: "회원 등록이 완료되었습니다." });
        } catch (error) {
            res.status(500).json({ error: "회원 등록 중 오류가 발생했습니다." });
        }
    })

    router.get("/api/findUsersInfo", async (req, res) => {
        const nickname = req.query.nickname;
        const usersInfo = await db
            .collection("User")
            .find({ "Nickname": { $regex: nickname, $options: 'i' } })
            .toArray();

        if(usersInfo.length > 0) res.status(200).json(usersInfo);
        else res.status(404).json({ message: "회원을 찾지 못했습니다!" });
    })

    router.get("/api/getUserPermissionLevel", async (req, res) => {
        const id = req.query.id;

        try {
            if(id) {
                const user = await db
                    .collection("User")
                    .findOne({"ID": id});

                if(user) return res.json(user.Permission_Level);
                else return res.status(404).json({ message: '해당 아이디를 가진 유저를 찾지 못했습니다!' });
            }
            else {
                return res.status(404).json({ message: '아이디가 없습니다!' });
            }
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: 'Server Error!!'});
        }
    })

    return router;
}

module.exports = User;