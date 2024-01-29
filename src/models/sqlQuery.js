const databaseUsers = require('../config/databaseUsers');

exports.responseContructor = async (products, res) => {
    let result = [], counter = 0;

    if(products.length == 0){
        res.status(400).send("db");
    } else {

        async function market(itm){
            let obj = itm, counterMarket = 0;
            let prices = await databaseUsers.searchDB(`* FROM products_stores WHERE product = '${obj.barcode}'`);
            obj.market= [];

            prices.forEach(async(elm) => {
                let market = await databaseUsers.searchDB(`* FROM stores WHERE id = '${elm.store}'`);

                obj.market.push({
                    name: market[0].name,
                    image: market[0].image,
                    price: elm.price,
                    promo: elm.promo
                });

                counterMarket++;

                if(prices.length == counterMarket){

                    obj.market.sort((a, b) => {
                        if ( a.price < b.price ){
                            return -1;
                        }
                        if ( a.price > b.price ){
                            return 1;
                        }
                        return 0;
                    })

                    result.push(obj);

                    counter++;
                    
                    if(products.length == counter){
                        res.status(200).json(result);
                    }
                }
            });
        }

        products.forEach(async(item) => {
    
            await market(item);
        });
    }
}

exports.responseContructorOrder = async (products, order, marketType, res) => {
    let result = [], counter = 0;

    if(products.length == 0){
        res.status(400).send("db");
    } else {

        async function market(itm){
            let obj = itm, counterMarket = 0;
            let prices = await databaseUsers.searchDB(`* FROM products_stores WHERE product = '${obj.barcode}'`);
            obj.market= [];

            prices.forEach(async(elm) => {
                let market = await databaseUsers.searchDB(`* FROM stores WHERE id = '${elm.store}'`);

                if(marketType == 0 || marketType == market[0].id){
                    obj.market.push({
                        name: market[0].name,
                        image: market[0].image,
                        price: elm.price,
                        promo: elm.promo
                    });
                }

                counterMarket++;

                if(prices.length == counterMarket){
                    
                    if(order == 'true'){
                        obj.market.sort((a, b) => {
                            if ( a.price < b.price ){
                                return 1;
                            }
                            if ( a.price > b.price ){
                                return -1;
                            }
                            return 0;
                        })
                    } else {
                        obj.market.sort((a, b) => {
                            if ( a.price < b.price ){
                                return -1;
                            }
                            if ( a.price > b.price ){
                                return 1;
                            }
                            return 0;
                        })
                    }

                    if(obj.market.length !== 0){
                        result.push(obj);
                    }

                    counter++;
                    
                    if(products.length == counter){
                        res.status(200).json(result);
                    }
                }
            });
        }

        products.forEach(async(item) => {
    
            await market(item);
        });
    }
}

exports.responseProductConstructor = async (products, user, res) => {
    if(user == null){
        let allProducts = [], counter = 0;

        products.forEach(async(obj) => {
            let refinedProduct = await databaseUsers.searchDB(`* FROM products WHERE barcode = '${obj.product}'`);
            
            if(refinedProduct.length >= 1){
                let market = await databaseUsers.searchDB(`* FROM stores WHERE id = '${obj.store}'`);

                if(market.length >= 1){
                    market = market[0];
                    let finalObj = refinedProduct[0];
                    obj = {
                        market: market.name,
                        image: market.image,
                        price: obj.price,
                        promo: obj.promo,
                    }
                    finalObj.market = [obj];
                    allProducts.push(finalObj);
                }
            }

            counter++;

            if(counter == products.length){
                res.status(200).json(allProducts);
            }
        });
    } else {
        let userDB = await databaseUsers.searchDB(`* FROM client WHERE email = '${user}'`);
        let order = await databaseUsers.searchDB(`* FROM orders WHERE client = '${user}'`);

        if(userDB.length >= 1 && order.length >= 1){
            order = order[0];
            userDB = userDB[0];
            let userInfo = {
                name: userDB.name,
                adress: userDB.adress,
                phoneNumber: userDB.phoneNumber,
                nif: userDB.nif,
                status: order.status,
                products: []
            }

            let allProducts = [], counter = 0;

            products.forEach(async(obj) => {
                let refinedProduct = await databaseUsers.searchDB(`* FROM products WHERE barcode = '${obj.product}'`);
                
                if(refinedProduct.length >= 1){
                    let market = await databaseUsers.searchDB(`* FROM stores WHERE id = '${obj.store}'`);

                    if(market.length >= 1){
                        market = market[0];
                        let finalObj = refinedProduct[0];
                        obj = {
                            market: market.name,
                            image: market.image,
                            price: obj.price,
                            promo: obj.promo,
                            amount: obj.amount,
                        }
                        finalObj.market = [obj];
                        allProducts.push(finalObj);
                    }
                }

                counter++;

                if(counter == products.length){
                    userInfo.products = allProducts
                    res.status(200).json(userInfo);
                }
            });
        }
    }
}

exports.dataVerified = (data, callback) =>{
        let values = ['productSize', 'productRef', 'market', 'price', 'productName', 'productImage', 'promo'];
        let count = 0;

        if(Object.keys(data).length >= 1){

            Object.keys(data).forEach((key) => {

                if(values.includes(key)){
                    if(data[key] == undefined || (data[key] == '' && key !== 'promo')){
                        console.log(data[key], key);
                        return callback(false);
                    }
                }

                count++;

                if(Object.keys(data).length == count){
                    return callback(true);
                }
            })
        } else  {
            return callback(false);
        }
}

exports.dataVerifiedPut = (data, callback) =>{
    let values = ['productRef', 'market', 'price', 'promo'];
    let count = 0;

    if(Object.keys(data).length >= 1){

        Object.keys(data).forEach((key) => {

            if(values.includes(key)){
                if(data[key] == undefined || (data[key] == '' && key !== 'promo')){
                    console.log(data[key], key);
                    return callback(false);
                }
            }

            count++;

            if(Object.keys(data).length == count){
                return callback(true);
            }
        })
    } else  {
        return callback(false);
    }
}

exports.adressVerify = (adressInfo, callback) =>{
    let verifiedKeys = ['image', 'name', 'adress', 'phoneNumber', 'nif'], counter = 0;

    Object.keys(adressInfo).forEach((key)=>{
        let keyNotArray = !(verifiedKeys.includes(key));
        if(!(typeof adressInfo[key] === 'string') || adressInfo[key] == undefined || keyNotArray || (key == 'image' && adressInfo.image == '') ||  (key == 'name' && adressInfo.name == '')){
            return callback(false);
        }
        counter++;
        if(counter == Object.keys(adressInfo).length){
            return callback(true);
        }
    })
}