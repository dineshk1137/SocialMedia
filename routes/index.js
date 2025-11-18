const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Posts = require('../models/Post');

router.get('/', async (req, res) => {
    if (!req.session.userId) {return res.redirect('/auth/login');}
    const posts = await Posts.find({}).populate('author','username').populate('comments.author','username' ).sort({ createdAt: -1 }).lean();  
    const user = await User.findById(req.session.userId);
    res.render('index', { title: 'Home', posts , user });
});
module.exports = router;