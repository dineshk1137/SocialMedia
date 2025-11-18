const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all Users
router.get('/', async (req, res) => {
    const users = await User.find({_id: { $ne : req.session.userId}}, 'username email').lean();
    const currentUser = await User.findById(req.session.userId);
    res.render('users', { title: 'All Users', users, currentUser });
});

module.exports = router;