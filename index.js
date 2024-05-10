const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const users = [
    {   
        id: '0001',
        email: 'joao@exemplo.com.br',
        password: 'senha1234',
        profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    }
]
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Static files
app.use('/static', express.static(path.resolve(__dirname, 'frontend', 'assets')));

// API routes
app.post('/api/login', async (req, res) => {
    const user = await users.find(obj => obj.email === req.body.email);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.password != req.body.password) return res.status(401).json({ message: 'Wrong password'});
    const token = await jwt.sign({ id: user.id }, 'JWT_LOGIN_SECRET');
    return res.status(200).cookie('accessToken', token, { maxAge:  7 * 24 * 60 * 60 * 1000 }).json({ message: 'User Logged Succefully' });
})

// SPA route
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'))
})

app.listen(port, () => {
    console.log(`Express server running on port ${port}!`)
})