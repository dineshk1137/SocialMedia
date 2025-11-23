const express = require('express');
const connectDB = require('./config/db');
const mongoStore = require('connect-mongo');
const session = require('express-session');
const { createServer } = require('http');
const { Server } = require('socket.io');

const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.json());

// DB Connection
connectDB();

// Ejs 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ mongoUrl: "mongodb+srv://Dinesh:Dinesonic1@newcluster.1x50dw9.mongodb.net/?appName=NewCluster"}),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

//middleware to make user info available in all views
app.use((req, res, next) => {
    res.locals.username = req.session.username || null;
    next();
});

app.use('/', require('./routes/index'));
app.use('/', require('./routes/follows'));
app.use('/chat', require('./routes/chat'))
app.use('/posts', require('./routes/posts'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/users', require('./routes/users'));


io.on("connection", socket => {
    console.log("Connected");

    // Joining a room
    socket.on('joinChat', async ({ chatId, userId }) => {
        socket.join(chatId);
        console.log(`User ${userId} joined chat ${chatId}`);
    });

    // Sending a message
    socket.on('sendMessage', async ({ chatId, userId, content }) => {

        // Save in DB
        const message = await Message.create({
            chat: chatId,
            sender: userId,
            content
        });

        const user = await User.findById(userId);

        // Emit to all users in room
        io.to(chatId).emit('newMessage', {
            chatId,
            sender: user.username,
            senderId:user._id,
            content,
            createdAt: message.createdAt
        });

        console.log(`User ${userId} sent message to chat ${chatId}: ${content}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

});


server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});