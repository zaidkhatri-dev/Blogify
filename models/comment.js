const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

const Comment = mongoose.model('comment',commentSchema)

module.exports = Comment