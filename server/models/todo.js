const mongoose = require('mongoose');
var Todo = mongoose.model('Todo',{
    text:{
       type:String,
       required:true ,//fail not setting  if we are not setting value
       minlength:1,
       trim:true //remove void space
    },
    completed:{
       type:Boolean,
       default:false
    },
    completedAt:{
       type:Number,
       default:null
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

module.exports={Todo};