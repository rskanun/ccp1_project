const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require('cookie');

const router = express.Router();

const secretKey = "4{s]%K$rgC?GGzf!";

const login = (db) => {
    router.post("/api/login", async (req, res) => {
        try {
            const { id, pw } = req.body;

            // 해당 아이디와 비밀번호를 가진 계정 확인
            const account = await db
                .collection("User")
                .findOne({"ID": id, "Password": pw});
                
            // 해당 계정이 데이터베이스 상에 존재할 경우
            if(account) {
                const token = jwt.sign(id, secretKey);
                res.setHeader('Set-Cookie', cookie.serialize('loginID', token, { httpOnly: true }));

                return res.status(200).json({ token });
            }
            else return res.status(401).json({ message: "Not Found This Account"});
        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!'});
        }
    })

    router.post("/api/loginCheck", async (req, res) => {
        const token = req.body.token;

        if (!token) {
            return res.status(400).json({ message: "Token is missing" });
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            
            return res.status(200).json({ id: decoded });
        } catch (e) {
            return res.status(401).json({ message: "Invalid Token"});
        }
    })

    return router;
}
module.exports = login;