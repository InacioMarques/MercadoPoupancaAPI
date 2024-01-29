const service = require('../services/managePromo')

exports.promoGet = (req, res) =>{
    service.getPromo(req, res);
}