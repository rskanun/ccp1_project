const express = require("express");
const router = express.Router();

const Profile = (db, form_data) => {
    router.get("/api/getUserProfile", async (req, res) => {

    });

    router.post("api/uploadImage", form_data.single("img"), async(req, res) => {

    });

    return router;
}


module.exports = Profile;