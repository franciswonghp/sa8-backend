const express = require('express');
const { connectToDB, getConnection } = require('./sql');
require('dotenv').config();

const app = express();

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



app.listen(3000, function(){
    console.log("server has started");
})