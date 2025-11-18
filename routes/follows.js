const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Follow/Unfollow a user
router.post('/follow/:username', async (req, res) => {
    if (!req.session.userId) {return res.redirect('/auth/login');}
    const userToFollow = req.params.username;
    const currentUserId = req.session.userId;

    try {
        const user = await User.findById(currentUserId);
        const userToFollowDoc = await User.findOne({ username: userToFollow });
        if (!userToFollowDoc) {
            return res.status(404).send('User to follow not found.');
        }

        const isFollowing = user.following.includes(userToFollowDoc._id);
        if (isFollowing) {
            user.following.pull(userToFollowDoc._id);
            userToFollowDoc.followers.pull(user._id);
        } else {
            user.following.push(userToFollowDoc._id);
            userToFollowDoc.followers.push(user._id);
        }
        await user.save();
        await userToFollowDoc.save();

        res.json({ success: true, 
            isFollowing: !isFollowing, 
            followingCount: user.following.length,
            username: userToFollow,
            followersCount: userToFollowDoc.followers.length
         });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your follow request.');
    }   
});

module.exports = router;