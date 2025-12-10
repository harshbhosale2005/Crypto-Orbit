const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection & Schema
mongoose.connect('mongodb://127.0.0.1:27017/simple-crypto')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    watchlist: [String] // Stores coin IDs
});
const User = mongoose.model('User', UserSchema);

const SECRET_KEY = "mysecretkey"; // Keep this simple for now

//  Middleware (Checks if you are logged in)
const verifyToken = (req, res, next) => {
    const token = req.headers['auth-token'];
    if (!token) return res.status(401).send('Access Denied');
    
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; // Adds user ID to the request
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

//  Routes

// REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.send('User Registered');
    } catch (err) { res.status(400).send(err.message); }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found');

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');

        const token = jwt.sign({ _id: user._id }, SECRET_KEY);
        res.json({ token, email: user.email });
    } catch (err) { res.status(400).send(err.message); }
});


// GET COINS 

app.get('/coins', async (req, res) => {
    try {
        //  Capture the page number from the frontend 
        const page = req.query.page || 1;
        const limit = 10; // Number of coins per page

        //  Pass these params to CoinGecko
      
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false`
        );
        
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching coins:", error.message);
        res.status(500).json({ error: "Failed to fetch coins" });
    }
});

app.post('/watchlist', verifyToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    const coinId = req.body.coinId;

    if (user.watchlist.includes(coinId)) {
        // If it exists, remove it
        user.watchlist = user.watchlist.filter(id => id !== coinId);
    } else {
        // If it doesn't exist, add it
        user.watchlist.push(coinId);
    }
    
    await user.save();
    res.json(user.watchlist);
});
// GET WATCHLIST (Private)
app.get('/watchlist', verifyToken, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user.watchlist);
});

app.listen(5000, () => console.log('Server running on port 5000'));