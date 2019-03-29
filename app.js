const express = require('express');
const chalk = require('chalk');
const getRawBody = require('raw-body');
const crypto = require('crypto');
const morgan = require('morgan');


const secretKey = '*********';

const storeLogin = {
  shopName: 'your-store.myshopify.com',
  apiKey: 'API_KEY',
  password: 'API_PASSWORD',

};

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

app.post('/webhooks/orders/create', async (req, res) => {
  console.log('🎉 We got an order!');

  const hmac = req.get('X-Shopify-Hmac-Sha256');

  const body = await getRawBody(req);

  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(body, 'utf8', 'hex')
    .digest('base64');

  if (hash === hmac) {
    const order = JSON.parse(body.toString());
    const orderId = order.id;
    console.log(chalk.green('Phew, it came from Shopify!'));
    const orderUpdate = require('./src/order_update');

    orderUpdate(storeLogin, orderId);

    
  } else {

    console.log(`${chalk.red('Danger!')} Not from Shopify!`);
    res.sendStatus(403);

  }

});

app.listen(3000, () => {
  console.log(`Example app listening on port ${chalk.green(port)}`);
});
