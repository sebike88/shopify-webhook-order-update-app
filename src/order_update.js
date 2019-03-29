const Shopify = require('shopify-api-node');


function orderUpdate(storeCredentials, orderId) {

  const shopify = new Shopify(storeCredentials);

  (async function () {
    const { note } = await shopify.order.update(orderId, {
      id: orderId,
      note: 'This is a test note'
    });
  
    console.log(note);
  })().catch((err) => console.log(err.response.body));
}

module.exports = orderUpdate;