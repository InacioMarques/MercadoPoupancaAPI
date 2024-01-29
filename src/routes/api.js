const express = require('express');
const jwt = require('../utils/token')

const router = express.Router();

router.get("/", async(req, res) =>{
    let query = req.query;

    switch(query.type){
        case 'withUser':
            jwt.validateToken(req, res, function callback () {
                res.status(200).send('Conneted With Account')
            })
        break;
        default:
            res.status(200).send('Conneted')
    }
});

module.exports = router;