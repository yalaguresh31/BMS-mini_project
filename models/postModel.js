const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default: ''
    },
    views:{
        type:Number,
        default:0
    },
    comments:{
        type:Object,
        default:{}
    }
});

module.exports = mongoose.model('Post',postSchema);
