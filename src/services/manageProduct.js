const databaseUsers = require('../config/databaseUsers');
const databaseAdmin = require('../config/databaseAdmin')
const model = require('../models/sqlQuery');

exports.searchProductAll = async (data, res) =>{
    let sqlQuery = '* FROM products';
    let products =  await databaseUsers.searchDB(sqlQuery, res);
    
    model.responseContructor(products, res);
};

exports.searchProductName = async (data, res) =>{
    let sqlQuery = `* FROM products WHERE name LIKE '%${data.productRef}%'`
    let products = await databaseUsers.searchDB(sqlQuery);

    model.responseContructor(products, res);
};

exports.searchProductBarcode = async (data, res) =>{
    let sqlQuery = `* FROM products WHERE barcode = '${data.productRef}'`
    let products = await databaseUsers.searchDB(sqlQuery);

    model.responseContructor(products, res);
};

exports.searchProductOrder = async (order, market, data, res) =>{
    let sqlQuery = '* FROM products';
    let products =  await databaseUsers.searchDB(sqlQuery, res);
    
    model.responseContructorOrder(products, order, market, res);
};

exports.postProduct = async (data, res) =>{
    model.dataVerified(data, async function callback (verified) {
        if(verified == true){
            let markets = await databaseUsers.searchDB('* FROM stores');
    
            if(markets.length >= 1){
    
                markets.forEach(async(obj) => {
    
                    if(obj.name == data.market){
                        let product = await databaseUsers.searchDB(`* FROM products WHERE barcode = '${data.productRef}'`);
    
                        if(product.length == 0){
                            let updateProduct = await databaseAdmin.insertDB(`products (barcode, name, image, size) VALUES ('${data.productRef}', '${data.productName}', '${data.productImage}', '${data.productSize}')`);
                            let update = await databaseAdmin.insertDB(`products_stores (price, promo, product, store) VALUES ('${data.price}', '${data.promo}', '${data.productRef}', '${obj.id}')`);
                            
                            if(update.affectedRows >= 1 && updateProduct.affectedRows >= 1){
                                res.status(200).send("updated")
                            } else {
                                res.status(404).send("err DB");
                            };
                        } else {
                            res.status(409).send("Product already exist");
                        }
                    };
                });
            } else {
                res.status(404).send("err DB");
            }
        } else {
            res.status(404).send('Invalid body request');
        }
    });
};

exports.putProductPrice = async (data, res) =>{
    model.dataVerifiedPut(data, async function callback(verified) {
        if(verified == true){
            let markets = await databaseUsers.searchDB('* FROM stores');
    
            if(markets.length >= 1){
    
                markets.forEach(async(obj) => {
    
                    if(obj.name == data.market){
                        let product = await databaseUsers.searchDB(`* FROM products WHERE barcode = '${data.productRef}'`);
    
                        if(product.length >= 1){
                            let productsPrice = await databaseUsers.searchDB(`* FROM products_stores WHERE product = '${data.productRef}' AND store = '${obj.id}'`);
                            
                            if(productsPrice.length >= 1){
                                let update = await databaseAdmin.updateDB(`products_stores SET price = '${data.price}', promo = '${data.promo}' WHERE product = '${data.productRef}' and store = '${obj.id}'`);
    
                                if(update.affectedRows >= 1){
                                    res.status(200).send("updated")
                                };
                            } else {
                                let update = await databaseAdmin.insertDB(`products_stores (price, promo, product, store) VALUES ('${data.price}', '${data.promo}', '${data.productRef}', '${obj.id}')`);

                                if(update.affectedRows >= 1){
                                    res.status(200).send("updated")
                                };
                            }
                        } else {
                            res.status(404).send('product not exist');
                        }
                    };
                });
            } else {
                res.status(404).send("err DB");
            }
        } else {
            res.status(400).send('Invalid body request');
        }
    });
};

exports.deleteProduct = async (data, res) =>{
    if(data.productRef !== ''){
        let markets = await databaseUsers.searchDB('* FROM stores');

        if(markets.length >= 1){
            markets.forEach(async(obj) => {
                if(obj.name == data.market){
                    let deleteProduct = await databaseAdmin.deleteDB(`FROM products_stores WHERE product = ${data.productRef}`);

                    if(deleteProduct.affectedRows >= 1){
                        res.status(200).send('deleted');
                    }
                }
            });
        };  
    } else {
        res.status(400).send('Invalid body request');
    }
};