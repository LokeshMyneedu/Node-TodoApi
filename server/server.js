require('./config/config');
let express = require('express');
let bodyParser = require('body-parser');
const{ObjectID}= require('mongodb');
const _ = require('lodash');

let {mongoose}=require('./db/mongoose');
let {Todo}= require('./models/todo');
let {User}= require('./models/user');
let {authenticate}= require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//post
app.post('/todos',authenticate,(req,res)=>{
console.log(req.body);
var todo = new Todo({
    text:req.body.text,
    _creator:req.user._id
});
todo.save().then((doc)=>{
    res.send(doc);
}).catch((err)=>{
    res.status(400).send(err);
})
});

//full get
app.get('/todos',authenticate,(req,res)=>{
    Todo.find({
        _creator:req.user._id
    }).then((todos)=>{
        res.send({todos});    
    }).catch((err)=>{
        res.status(400).send(err);
    });
    });

//get by id    
    app.get('/todos/:id',authenticate,(req,res)=>{
        let id = req.params.id;
       if(!ObjectID.isValid(id)){
           return res.status(404).send();
       }
       Todo.findOne({
           _id:id,
           _creator:req.user._id

       }).then((result)=>{
           if(!result){
               return res.status(404).send('Data Not found')
           }
           res.send({result});
       }).catch(e=> res.status(400).send()); 
        }); 

//delete by id
    app.delete('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then((result)=>{
        if(!result){
            return res.status(404).send('Data Not found')
        }
        res.send({result});
    }).catch(e=> res.status(400).send()); 
     }); 

//patch route

app.patch('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    };
    if(_.isBoolean(body.completed)&& body.completed){
       body.completedAt = new Date().getTime();
    }else{
       body.completed=false;
       body.completedAt=null;
    } 
    Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((result)=>{
        if(!result){
            return res.status(404).send('Data Not found')
        }
        res.send({result});
    }).catch(e=> res.status(400).send()); 
})

//users post
//sign up 
app.post('/user',(req,res)=>{
    let body = _.pick(req.body,['email','password']);
    let user = new User(body);
    user.generateAuthToken().then((token)=>{
        res.header('x-auth',token).send(user)           
    }).catch((err)=>{
        res.status(400).send(err);
    })
    });

//get user

app.get('/user/me',authenticate,(req,res)=>{
   res.send(req.user);
});

//post /users/login
//sign in
app.post('/user/login',(req,res)=>{
    var body =_.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
   return user.generateAuthToken().then((token)=>{
    res.header('x-auth',token).send(user); 
   });
    }).catch((e)=>{
    res.status(400).send();
    });

})

//users/logout

app.delete('/user/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch((e)=>req.status(401).send());
})


app.listen(port,()=>{
    console.log(`started on port ${port}`);
});

module.exports ={
    app};





