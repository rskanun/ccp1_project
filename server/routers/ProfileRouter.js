const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

const Profile = (db, form_data) => {
    router.get("/api/getUserProfile", async (req, res) => {
        const id = req.query.id;

        try {
            if (id) {
                const profile = await db
                    .collection("Profile")
                    .findOne({ "User_ID": id });

                if (!profile) {
                    const user = await db
                        .collection("User")
                        .findOne({ "ID": id });

                    if (user) {
                        await db.collection("Profile")
                            .insertOne({
                                "User_ID": id,
                                "Introduction": "소개글을 넣어주세요."
                            });

                        return res.json({ Introduction: "소개글을 넣어주세요." });
                    }
                    else return res.status(404).json({ message: "해당 유저를 찾을 수 없습니다!" });
                }
                else return res.json(profile);
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Server Error" });
        }
    });

    router.patch("/api/updateIntro", async (req, res) => {
        const id = req.body.id;
        const newIntro = req.body.introduction;
        try {
            const result = await db
                .collection("Profile")
                .findOneAndUpdate(
                    { User_ID: id },
                    { $set: { Introduction: newIntro } }
                );

            if (result.value) {
                return res.status(200).json({ message: "업데이트 완료" })
            } else {
                return res.status(404).json({ message: "아이디를 찾을 수 없습니다!" });
            }
        } catch (e) {
            return res.status(500).json({ message: "서버 오류" });
        }
    })

    router.post("/api/uploadProfileImage", form_data.single("img"), async (req, res) => {
        try {
            const id = req.body.userID;
            const { mimetype, buffer } = req.file;

            // 이미지를 Base64로 변환
            const imageBase64 = buffer.toString('base64');

            // 데이터베이스에 저장
            const result = await db
                .collection("Profile")
                .findOneAndUpdate(
                    { User_ID: id },
                    {
                        $set: {
                            Profile_Picture: {
                                contentType: mimetype,
                                imageBase64: imageBase64,
                            }
                        }
                    }
                );

            if (result.value) {
                return res.status(200).json({ message: "업데이트 완료" })
            } else {
                return res.status(404).json({ message: "아이디를 찾을 수 없습니다!" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    })

    router.get('/api/getProfileImage/', async (req, res) => {
        try {
            const id = req.query.userID;

            // 데이터베이스에서 이미지 정보 가져오기
            const result = await db
                .collection("Profile")
                .findOne({ User_ID: id });

            if ((result !== null) && (result.Profile_Picture !== undefined)) {
                const { contentType, imageBase64 } = result.Profile_Picture;
                const imageData = Buffer.from(imageBase64, 'base64');

                // 클라이언트에 이미지 데이터 전송
                res.status(200).json({
                    contentType: contentType,
                    imageBase64: imageData.toString('base64')
                });
            } else {
                res.status(404).json({ message: "이미지를 찾을 수 없습니다!" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    router.get("/api/getUserCreativeImages", async (req, res) => {
        const id = req.query.id;
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const imagesPerPage = 3;

        try {
            // 전체 게시물 수를 가져옴
            const totalImgs = await db.collection("CreativeImages").countDocuments({ "User_ID": id });

            // 페이징을 위한 오프셋 계산
            const skip = (currentPage - 1) * imagesPerPage;

            // 데이터베이스에서 이미지 정보 가져오기
            const results = await db
                .collection("CreativeImages")
                .find({ User_ID: id })
                .skip(skip)
                .limit(imagesPerPage)
                .toArray();

            if ((results.length > 0)) {
                const imgList = results.map((img) => {
                    const { contentType, imageBase64 } = img.Creative_Image;
                    const imageData = Buffer.from(imageBase64, 'base64');

                    return ({
                        pk: img._id,
                        category: img.Category,
                        otherCategory: img.Other_Category.replace(/\s/g, '_'),
                        img: {
                            contentType: contentType,
                            imageBase64: imageData.toString('base64')
                        }
                    })
                })

                res.status(200).json({
                    imgs: imgList,
                    totalPages: Math.ceil(totalImgs / imagesPerPage)
                });
            } else {
                res.status(404).json({ message: "이미지를 찾을 수 없습니다!" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    })

    router.post("/api/uploadImage", form_data.single("img"), async (req, res) => {
        try {
            const { id, category, otherCategory } = req.body;
            const { mimetype, buffer } = req.file;

            // 이미지를 Base64로 변환
            const imageBase64 = buffer.toString('base64');

            // 데이터베이스에 저장
            const result = await db
                .collection("CreativeImages")
                .insertOne({
                    User_ID: id,
                    Category: category,
                    Other_Category: otherCategory,
                    Creative_Image: {
                        contentType: mimetype,
                        imageBase64: imageBase64
                    }
                });

            return res.status(200).json({ message: "업로드 완료" })
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    router.get("/api/getUploadImgesCount", async (req, res) => {
        const id = req.query.id;
        try {
            const count = await db.collection("CreativeImages").countDocuments({ "User_ID": id });

            return res.status(200).json(count);
        } catch (e) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    router.delete("/api/delCreativeImage", async (req, res) => {
        const imageId = new ObjectId(req.query.imageId);
    
        try {
            const result = await db.collection("CreativeImages").deleteOne({ "_id": imageId });
    
            if (result.deletedCount > 0) {
                return res.status(200).json({ message: "이미지 삭제 완료" });
            } else {
                return res.status(404).json({ message: "이미지를 찾을 수 없습니다!" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
}


module.exports = Profile;