const service = require('../services/manageVerify')

exports.verifyGet = (req, res) =>{
    service.getVerify(req, res);
}