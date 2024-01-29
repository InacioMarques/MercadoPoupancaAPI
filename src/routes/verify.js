const express = require('express');
const controller = require('../controllers/verifyController');

const router = express.Router();

router.get("/", async(req, res) =>{
    controller.verifyGet(req, res);
});

module.exports = router;