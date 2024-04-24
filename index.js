const express = require('express');
const cors = require('cors');
const { connectToDB, getConnection } = require('./sql');
require('dotenv').config();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();

// A RESTFul API accepts JSON (is the norm for JavaScript)
app.use(express.json());

// Make our RESTFul API public
app.use(cors());
function verifyJWT(req, res, next) {
    const authorization = req.headers['authorization'];
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, payload) {
        if (err) {
            res.sendstatus(401);
            return;
        }
        req.user = payload;
        next();

    })
}

async function hashPassword(password) {
    try {
        const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
        return hash;
    } catch (e) {
        console.log("Error generating hashed pasword");
        return "";

    }
}

async function main() {

    await connectToDB(
        process.env.DB_HOST,
        process.env.DB_USER,
        process.env.DB_DATABASE,
        process.env.DB_PASSWORD
    );

    const connection = getConnection();
    app.get('/api/products', async function (req, res) {
        //get all the product
        const [products] = await connection.execute("SELECT * FROM products");
        res.json({
            products
        })
    })

    app.post("/api/products", async function (req, res) {
        const results = await connection.execute(`INSERT INTO products (product_name, description, price, stock_quantity)
        VALUES (?,?,?,?)`, [req.body.product_name, req.body.description, req.body.price, req.body.stock_quantity]);
        res.json({ results });
    })

    app.put("/api/products/:product_id", async function (req, res) {
        const { product_name, description, price, stock_quantity } = req.body;
        const sql = "UPDATE products SET product_name=?, description=?, price=?, stock_quantity=? WHERE product_id=?";
        await connection.execute(sql, [product_name, description, price, stock_quantity, req.params.product_id]);
        res.json({
            message: "update sucessfull"
        })
    })
    app.delete('/api/products/:product_id', async function (req, res) {

        const sql = "DELETE FROM products WHERE product_id = ?";
        await connection.execute(sql, [req.params.product_id]);
        res.json({
            "message": "Deleite sucessful"
        })
    })
    app.post('/api/users', async function (req, res) {
        console.log(req.body)
        const { email, password } = req.body;
        const hashedPassword = await hashPassword(password)

        const sql = "Insert INTO users (email, password) VALUES (?,?)";
        const [user] = await connection.execute(sql, [email, hashedPassword]);
        res.json({
            user
        });

    })
    app.post('/api/login', async function (req, res) {

        const [users] = await connection.execute("SELECT * FROM users WHERE email = ? ", [req.body.email])
        const user = users[0];

        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const userData = {
                    id: user.id,
                    email: user.email
                }
                console.log(userData)
                const token = jwt.sign(userData, process.env.TOKEN_SECRET, {
                    expiresIn: '1h'
                })
                res.json({
                    'message ': "login sucessful",
                    "token": token
                })
            }
        } else {
            res.status(400);
            res.json(
                { 'error': 'Invalid login' }
            )
        }
    })
    app.get('/api/profile', verifyJWT, function(req,res){
        res.json({
            'user': req.user
        });
    })
} // main



main();



app.listen(3000, function () {
    console.log("server has started");
})