const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://Dinesh:Dinesonic1@newcluster.1x50dw9.mongodb.net/?appName=NewCluster");
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

module.exports = connectDB;