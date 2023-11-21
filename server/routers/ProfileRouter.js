const express = require("express");
const router = express.Router();

const Profile = (db, form_data) => {
    router.get("/api/getUserProfile", async (req, res) => {
        const id = req.query.id;

        try {
            if(id) {
                const profile = await db
                    .collection("Profile")
                    .findOne({"User_ID": id});

                if(!profile) {
                    await db.collection("Profile")
                        .insertOne({
                            "User_ID": id,
                            "Introduction": "소개글을 넣어주세요."
                        });

                    return res.json({Introduction: "소개글을 넣어주세요."});
                }
                else return res.json(profile);
            }
        } catch(e) {
            console.log(e);
            return res.status(500).json({ message: "Server Error" });
        }
    });

    router.get("/api/getUserCreativeImages", async(req, res) => {
        
    })

    router.post("api/uploadImage", form_data.single("img"), async(req, res) => {

    });

    return router;
}


module.exports = Profile;