const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const chatSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = model('Chat', chatSchema);