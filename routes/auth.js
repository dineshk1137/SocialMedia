const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email});
    if(exists) return res.render('register',{error: 'User already exists'});
    await User.create({ username, email, password });
    res.redirect('/auth/login');
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login'});
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) return  res.send('Invalid username');
    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.send('Invalid password');
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;