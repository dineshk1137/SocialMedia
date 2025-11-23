const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');

function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
}

// Show the list of Users to start a chat
router.get('/',requireLogin, async (req, res) => {
    const users = await User.find({ _id: { $ne: req.session.userId }});
    res.render('chatList', { users });
});

// Create or get existing chat between two users
router.get('/:id',requireLogin, async (req, res) => {
    const otherUserId = req.params.id;
    const userId = req.session.userId;

    const user = await User.findOne({ userId })
    
    let chat = await Chat.findOne({ 
        members: { $all: [userId, otherUserId] } 
    });
    if (!chat) {
        chat = await Chat.create({ members: [userId, otherUserId] });
    }

    const messages = await Message.find({ chat: chat._id }).populate('sender').lean();

    res.render('chatRoom', { chat, messages, otherUserId, userId, user });
});

module.exports = router;