const model = require('../models/sqlQuery');
const databaseUsers = require('../config/databaseUsers')

exports.searchCatalog = async (market, req, res) =>{
    
    if(market == null){
        let sqlQuery = `* FROM products_stores WHERE promo > '0'`
        let products = await databaseUsers.searchDB(sqlQuery);

        if(products.length >= 1){
            model.responseProductConstructor(products, null, res);
        } else {
            res.status(404).send('products not found');
        }
    } else {
        let sqlQuery = `* FROM products_stores WHERE promo > '0' AND store = '${market}'`
        let products = await databaseUsers.searchDB(sqlQuery);

        if(products.length >= 1){
            model.responseProductConstructor(products, null, res);
        } else {
            res.status(404).send('products not found');
        }
    }
};