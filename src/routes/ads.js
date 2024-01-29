const express = require('express');
const controller = require('../controllers/adsController');

const router = express.Router();

router.get("/", async(req, res) =>{
    controller.adsGet(req, res);
});

module.exports = router;