const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoute = require('./src/routes/User');
const productRoute = require('./src/routes/product');
const catalogRoute = require('./src/routes/catalog');
const orderRoute = require('./src/routes/orders');
const adsRoute = require('./src/routes/ads');
const apiRoute = require('./src/routes/api');
const promoRoute = require('./src/routes/promo');
const verifyRoute = require('./src/routes/verify');

dotenv.config()
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}),
);
app.use('/', apiRoute);
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/catalog', catalogRoute);
app.use('/order', orderRoute);
app.use('/ads', adsRoute);
app.use('/promo', promoRoute);
app.use('/verify', verifyRoute);

app.listen(process.env.API_PORT, () => {
    console.log('live');
});