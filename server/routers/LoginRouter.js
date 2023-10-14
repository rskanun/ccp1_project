const dotenv = require('dotenv');
const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require('cookie');
const nodemailer = require('nodemailer');

const router = express.Router();
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    },
  });

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
                const token = jwt.sign(id, process.env.TOKEN_SECRET_KEY);
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

        // 쿠키에 아무것도 없는 경우
        if (!token) {
            return res.status(400).json({ message: "Token is missing" });
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
            
            return res.status(200).json({ id: decoded });
        } catch (e) {
            return res.status(401).json({ message: "Invalid Token"});
        }
    })

    router.get("/api/findID", async (req, res) => {
        const email = req.query.email;

        // 아무런 정보도 기입되지 않은 경우
        if (!email) {
            return res.status(400).json({ message: "E-mail is missing" });
        }

        try {
            const findData = await db
                .collection("User")
                .findOne({"Email": email});

            // 찾아낸 아이디가 있는 경우에만 전송
            if (findData) {
                const findID = findData.ID;
                const mailOptions = {
                    from: `Outsourcing<${process.env.NODEMAILER_USER}>`,
                    to: email,
                    subject: '아이디 찾기 결과',
                    text: `찾으시는 아이디의 정보입니다: ${findID}`,
                };
    
                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                      console.error(error);
                    }
                });
                
                return res.status(200).json({ id: maskString(findID) });
            }
            else return res.status(200).json({ id: null });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Server Error!!"})
        }
    })

    router.get("/api/findPassword", async (req, res) => {
        const id = req.query.id;
        const email = req.query.email;

        // 아무런 정보도 기입되지 않은 경우
        if (!(email && id)) {
            return res.status(400).json({ message: "E-mail or ID is missing" });
        }

        try {
            const findData = await db
                .collection("User")
                .findOne({"ID": id, "Email": email });

            // 찾아낸 아이디가 있는 경우에만 전송
            if (findData) {
                const findPassword = findData.Password;
                const mailOptions = {
                    from: `Outsourcing<${process.env.NODEMAILER_USER}>`,
                    to: email,
                    subject: '비밀번호 찾기 결과',
                    text: `찾으시는 비밀번호의 정보입니다: ${findPassword}`,
                };
    
                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                      console.error(error);
                    }
                });
                
                return res.status(200).json({ password: maskString(findPassword) });
            }
            else return res.status(200).json({ password: null });
        } catch (e) {
            return res.status(500).json({ message: "Server Error!!" });
        }
    })

    return router;
}
module.exports = login;

const maskString = (str) => {
    if (str && str.length > 2) {
        // 앞의 두 자리를 제외한 모든 자리의 글자를 마스킹
        const mask = '*'.repeat(str.length - 2);

        return str.slice(0, 2) + mask;
    }
    // 문자열이 2자리를 넘지 않는다면 그대로 출력
    return str;
}