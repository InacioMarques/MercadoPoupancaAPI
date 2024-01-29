const databaseUser = require('../config/databaseUsers');
const databaseAdmin = require('../config/databaseAdmin');
const model = require('../models/sqlQuery');
const email = require('../config/nodemail');

exports.getOrder = async(req, res) => {
    let user = req.user.user, count = 0, products = [];

    let order = await databaseUser.searchDB(`* FROM orders WHERE client = '${user}'`);

    if(order.length >= 1){
        let allProductOnOrder = await databaseUser.searchDB(`* FROM orders_products WHERE orderNumb = '${order[0].id}'`);

        if(allProductOnOrder.length >= 1){
            allProductOnOrder.forEach(async(obj) => {
                let product = await databaseUser.searchDB(`* FROM products_stores WHERE id = '${obj.product}'`);

                if(product.length >= 1){
                    product = product[0];
                    product.amount = obj.amount;
                    products.push(product);
                }

                count++;

                if(count == allProductOnOrder.length){
                    model.responseProductConstructor(products, user, res);
                }
            });
        }
    }
};

exports.getOrderAdmin = async(req, res) => {
    let id = req.query.id, user = '', count = 0, products = [];

    if(id !== undefined){
        let order = await databaseUser.searchDB(`* FROM orders WHERE id = '${id}'`);

        if(order.length >= 1){
            user = order[0].client;
            let allProductOnOrder = await databaseUser.searchDB(`* FROM orders_products WHERE orderNumb = '${order[0].id}'`);

            if(allProductOnOrder.length >= 1){
                allProductOnOrder.forEach(async(obj) => {
                    let product = await databaseUser.searchDB(`* FROM products_stores WHERE id = '${obj.product}'`);

                    if(product.length >= 1){
                        product = product[0];
                        product.amount = obj.amount;
                        products.push(product);
                    }

                    count++;

                    if(count == allProductOnOrder.length){
                        model.responseProductConstructor(products, user, res);
                    }
                });
            }
        }
    } else {
        res.status(400).send('whitout query id')
    }
};

exports.postOrder = async(req, res) => {
    let data = req.body, count = 0, user = req.user.user;
    
    let userData = await databaseUser.searchDB(`* FROM client WHERE email = '${user}'`);

    if(userData.length >= 1){
        userData = userData[0];
        let createOrder = await databaseAdmin.insertDB(`orders (client, status, adress) VALUES ('${userData.email}','Processing','${userData.adress}')`);

        if(createOrder.affectedRows >= 1){
            if(Array(data)){
                let orderId = createOrder.insertId;
                data.forEach(async(obj) => {
                    if((obj.product !== undefined || obj.product !== null) && (obj.store !== undefined || obj.store !== null || obj.store !== '')){
                        let store = await databaseUser.searchDB(`* FROM stores WHERE name = '${obj.store}'`);

                        if(store.length >= 1){
                            store = store[0];

                                let searchProduct = await databaseUser.searchDB(`* FROM products_stores WHERE product = '${obj.product}' AND store = '${store.id}'`);

                                if(searchProduct.length >= 1){
                                    searchProduct = searchProduct[0];
                                    await databaseAdmin.insertDB(`orders_products (orderNumb, product, amount) VALUES ('${orderId}', '${searchProduct.id}', '${obj.amount}')`);
                                }
                                count++;

                                if(count == data.length){
                                    await email.sendEmail(userData.email, userData.name, userData.adress, orderId);
                                    res.status(200).json([{msg: 'order recived', id: orderId}]);
                                }

                        } else {
                            res.status(404).send('store not found');
                        }
                    } else {
                        res.status(400).send('Bad body request');
                    }
                });
            } else {
                res.status(400).send('wrong body format');
            }
        }
    } else {
        res.status(404).send('user not found');
    }
};

exports.putStatusOrder = async(req, res) => {
    let data = req.body;
    let objStatus = true, count = 0;
    let keyInData = ['orderStatus', 'order'], valuesOrderStatus = ['processing', 'buying', 'deliveri', 'recived', 'completed'];

    Object.keys(data).forEach(async(key)=>{
        if(!(keyInData.includes(key))){
            objStatus = false;
        } else {
            if(key == 'orderStatus'){
                if(!(valuesOrderStatus.includes(data[key]))){
                    objStatus = false
                }
            }
            if(key == 'order'){
                if(data[key] !== undefined && data[key] !== null && data[key] !== ''){
                    objStatus = false
                }
            }
        }

        count++

        if(count == Object.keys(data).length && objStatus == true){
            let putStatusDb = await databaseAdmin.updateDB(`orders SET status = '${data.orderStatus}' WHERE id = '${data.order}'`);

            if(putStatusDb.length >= 1){
                res.status(200).send('updated status');
            }
        } else {
            res.status(404).send('body bad request');
        }
    });
};

exports.deleteOrder = async(req, res) =>{
    databaseAdmin.deleteDB(`FROM orders WHERE status = 'completed'`)
}