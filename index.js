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

    
}

main();



app.listen(3000, function () {
    console.log("server has started");
})