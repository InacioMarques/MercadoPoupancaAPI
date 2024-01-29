const service = require('../services/manageAds')

exports.adsGet = async(req, res) => {
    service.getAds(req, res);
};