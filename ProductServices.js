const datalayer = require('./ProductDataLayer');

async function getProducts() {
 return await datalayer.getProducts()
}

module.exports = {getProducts}