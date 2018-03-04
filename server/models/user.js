const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,//to check whether email exists or not
        validate:{
            validator:validator.isEmail,            
            message:'{value} is not valid input'
        }
        },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]    
});

userSchema.methods.toJSON = function(){ //create methods in instance
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
};

                             //create method at model level
userSchema.statics.findByToken = function(token){
        let User = this;
        let decoded;
        try{
             decoded = jwt.verify(token,'abc123');
        }catch(e){
        //   return new Promise( (resolve,reject)=>{
        //      reject();
        //   });
        return Promise.reject();
        }
        return User.findOne({
           _id : decoded._id,
           'tokens.token':token,
           'tokens.access':'auth'
        });
}
userSchema.methods.generateAuthToken = function(){
    let user = this;
    let access='auth';
    let token =jwt.sign({
     _id:user._id.toHexString(),
    },'abc123');
    user.tokens = user.tokens.concat([{
        access,
        token
    }]  
    )
    return user.save().then(()=>{
        return token;
    })
}
var User = mongoose.model('User',userSchema);

module.exports ={User};