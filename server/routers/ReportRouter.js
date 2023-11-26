const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

const Report = (db) => {
    router.post("/api/sendReport", async (req, res) => {
        const { userID, reason, content } = req.body;
        try {
            const result = await db
                .collection("Reports")
                .insertOne({
                    Accused: userID,
                    Category: reason,
                    Detail_Reason: content
                });

            return res.status(200).json({ message: "신고 완료" });
        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!' });
        }
    });

    router.get("/api/getReports", async (req, res) => {
        try {
            const result = await db
                .collection("Reports")
                .find({
                    Report_Status: "처리 중"
                })
                .toArray();

            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ message: '접수 중인 신고 목록이 없습니다' })
            }

        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!' });
        }
    });

    router.post("/api/userBan", async (req, res) => {
        const { userID, reason, duration } = req.body;
        const banDate = (duration > 0) ? 
            new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;

        try {
            const result = await db
                .collection("Blacklist")
                .insertOne({
                    User_ID: userID,
                    Reason: reason,
                    Duration: banDate
                })

            return res.status(200).json({ message: "정지 완료" });
        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!' });
        }
    });

    router.patch("/api/updateReportStatus", async (req, res) => {
        const { reportID } = req.body;
        try {
            const result = await db.collection("Reports").updateOne(
                { _id: new ObjectId(reportID) },
                { $set: { Report_Status: "처리 완료" } }
            );

            if (result.modifiedCount === 1) {
                return res.status(200).json({ message: "신고 처리 완료" });
            } else {
                return res.status(404).json({ message: "신고 내역을 찾을 수 없습니다!" });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Server Error!!' });
        }
    });

    router.get("/api/getBanReport", async (req, res) => {
        const { userID } = req.query;
        try {
            const result = await db
                .collection("Blacklist")
                .findOne({ User_ID: userID });

            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ message: 'Server Error!!' });
        }
    });

    return router;
}

module.exports = Report;