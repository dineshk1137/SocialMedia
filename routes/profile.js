const express = require('express');
const User = require('../models/User');
const router = express.Router();

// view user profile
router.get('/:username', async (req, res) => {
    if (!req.session.userId) {return res.redirect('/auth/login');}
    const username = req.params.username;
    const currentUser = req.session.username;
    const user = await User.findOne({ username }).select('-password');
    const currentUserData = await User.findOne({ username: currentUser }).select('-password');
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.render('profile', { title: `${user.username}'s Profile`, user , currentUser: currentUserData });
});

module.exports = router;