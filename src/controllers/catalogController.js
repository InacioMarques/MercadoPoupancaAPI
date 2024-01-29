const service = require('../services/manageCatalog')

exports.catalogGet = async(req, res) => {
    let querys = req.query
    switch(querys.market){
        case 'Mercadona':
            service.searchCatalog(1, req, res);
            break;
        case 'Pingo Doce':
            service.searchCatalog(2, req, res);
        break;
        case'Aldi':
            service.searchCatalog(3, req, res)
        break;

        case'Lidl':
            service.searchCatalog(4, req, res)
        break;

        case'Continente':
            service.searchCatalog(5, req, res)
        break;
        default:
            service.searchCatalog(null, req, res);
    }
};