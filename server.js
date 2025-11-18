const express = require('express');
const connectDB = require('./config/db');
const mongoStore = require('connect-mongo');
const session = require('express-session');
const app = express();
app.use(express.json());

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

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
app.use('/posts', require('./routes/posts'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/follows'));
app.use('/profile', require('./routes/profile'));
app.use('/users', require('./routes/users'));

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});