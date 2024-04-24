const { connectToDB, getConnection } = require('./sql');

async function getProducts() {
    const connection = getConnection();
    const [products]= await connection.execute ("SELECT * FROM products");
    return products;
}

module.exports = {getProducts}