const express = require('express');
const Posts = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Create a new post
router.get('/new', (req, res) => {
    if (!req.session.userId) {return res.redirect('/auth/login');}
    res.render('newPost', { title: 'Create New Post' });
});

router.post('/new', async (req, res) => {
    if (!req.session.username) {
        return res.redirect('/auth/login');
    }
    const { postTitle, content } = req.body;
    const user = await User.findOne({ username: req.session.username });
    await Posts.create({ postTitle, content, author: user._id });
    res.redirect('/');
});

router.post('/like/:postId', async (req, res) => {
    if (!req.session.userId) {return res.redirect('/auth/login');}
    const postId = req.params.postId;
    const userId = req.session.userId;
    try {
        const post = await Posts.findById(postId);
        if (!post) { return res.status(404).send('Post not found.'); }
        const alreadyLiked = post.likes.includes(userId);
        if (alreadyLiked) { post.likes.pull(userId); }
        else { post.likes.push(userId); }
        await post.save();
        res.json({ success: true, likesCount: post.likes.length, liked: !alreadyLiked });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

router.post('/comment/:postId', async (req, res) => {
    if (!req.session.userId) {return res.redirect('/auth/login');}

    const postId = req.params.postId;
    const userId = req.session.userId;
    const text = req.body.comment;

    try {
        const post = await Posts.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found.');
        }

        // Find user for username
        const user = await User.findById(userId).select("username");

        const newComment = {
            author: userId,
            text: text,
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        await post.populate('comments.author');
        const savedComment = post.comments[post.comments.length - 1];


        res.json({
            success: true,
            comment: {
                text: savedComment.text,
                author: savedComment.author.username
            },
            commentsCount: post.comments.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

router.delete('/comment/:postId/:commentId', async (req, res) => {
    if (!req.session.userId) {return res.redirect('/auth/login');}

    const { postId, commentId } = req.params;
    const userId = req.session.userId;

    try {
        const post = await Posts.findById(postId).populate('comments.author');

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Find comment
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        const isCommentAuthor = comment.author._id.equals(userId);
        const isPostAuthor = post.author.equals(userId);

        // Permission check
        if (!isCommentAuthor && !isPostAuthor) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Remove comment
        post.comments.id(commentId).deleteOne();
        await post.save();

        res.json({ 
            success: true,
            commentsCount: post.comments.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});



module.exports = router;

