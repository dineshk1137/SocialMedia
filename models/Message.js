const mongoose = require('mongoose');
const { Schema , model } = mongoose;

const messageSchema = new Schema({
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = model('Message', messageSchema);