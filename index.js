const express = require('express');
const cors = require('cors');
const { connectToDB, getConnection } = require('./sql');
require('dotenv').config();

const app = express();

// A RESTFul API accepts JSON (is the norm for JavaScript)
app.use(express.json());

// Make our RESTFul API public
app.use(cors());

async function main() {

    await connectToDB(
        process.env.DB_HOST,
        process.env.DB_USER,
        process.env.DB_DATABASE,
        process.env.DB_PASSWORD
    );

    const connection = getConnection();

    app.get('/api/customers', async function (req, res) {
        const [customers] = await connection.execute("SELECT * FROM Customers");
        res.json({
            'customers': customers
        })
    });

    app.post('/api/customers', async function (req, res) {
        // we can extract the data from req.body
        // (extract out each key's value as a variable use destructuring)
        const { first_name, last_name, rating, company_id } = req.body;
        const [results] =await connection.execute(`
            INSERT INTO Customers (first_name, last_name, rating, company_id)
            VALUES (?,?,?,?)
        `, [first_name, last_name, rating, company_id]);
        res.json(results);

    })
}

main();



app.listen(3000, function () {
    console.log("server has started");
})