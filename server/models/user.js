const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
             decoded = jwt.verify(token,process.env.JWT_SECRET);
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

userSchema.statics.findByCredentials = function(email,password){
    let user = this;
    try{
        return User.findOne({email}).then((user)=>{
            if(!user){
                return Promise.reject();
            }
            return new Promise((resolve,reject)=>{
                bcrypt.compare(password,user.password,(err,res)=>{
                    if(res){
                        resolve(user);
                    }else{
                        reject(user);
                    }
                })
            })
        })
    }catch(e){
        return Promise.reject();
    }
}
userSchema.methods.generateAuthToken = function(){
    let user = this;
    let access='auth';
    let token =jwt.sign({
     _id:user._id.toHexString(),
    },process.env.JWT_SECRET);
    user.tokens = user.tokens.concat([{
        access,
        token
    }]  
    )
    return user.save().then(()=>{
        return token;
    })
}

userSchema.methods.removeToken= function(token){
    let user= this;
        return user.update({
        $pull:{
           tokens:{
               token
           } 
        }
    });   
};

userSchema.pre('save',function(next){
let user = this;
if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(user.password,salt,(err,hash)=>{
            user.password=hash;
            next();
        })
    });
}else{
    next();
}
});
var User = mongoose.model('User',userSchema);

module.exports ={User};