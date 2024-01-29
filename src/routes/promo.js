const express = require('express');
const controller = require('../controllers/promoController');

const router = express.Router();

router.get("/", async(req, res) =>{
    controller.promoGet(req, res);
});

module.exports = router;