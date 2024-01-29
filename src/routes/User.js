const express = require('express');
const controller = require('../controllers/userControler');

const router = express.Router();

router.get("/", async(req, res) => {
    controller.userGet(req, res);
});

router.post("/", async (req, res) => {
    controller.userPost(req.query, req.body, res);
});

router.put("/", (req, res) => {
    controller.userPut(req, res);
});

router.delete("/", (req, res) => {
    controller.userDelete(req, res);
})

module.exports = router;