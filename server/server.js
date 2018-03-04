require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
const{ObjectID}= require('mongodb');
const _ = require('lodash');

var {mongoose}=require('./db/mongoose');
var {Todo}= require('./models/todo');
var {User}= require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//post
app.post('/todos',(req,res)=>{
console.log(req.body);
var todo = new Todo({
    text:req.body.text
});
todo.save().then((doc)=>{
    res.send(doc);
}).catch((err)=>{
    res.status(400).send(err);
})
});

//full get
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});    
    }).catch((err)=>{
        res.status(400).send(err);
    });
    });

//get by id    
    app.get('/todos/:id',(req,res)=>{
        let id = req.params.id;
       if(!ObjectID.isValid(id)){
           return res.status(404).send();
       }
       Todo.findById(id).then((result)=>{
           if(!result){
               return res.status(404).send('Data Not found')
           }
           res.send({result});
       }).catch(e=> res.status(400).send()); 
        }); 

//delete by id
    app.delete('/todos/:id',(req,res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((result)=>{
        if(!result){
            return res.status(404).send('Data Not found')
        }
        res.send({result});
    }).catch(e=> res.status(400).send()); 
     }); 
app.listen(port,()=>{
    console.log(`started on port ${port}`);
});

//patch route

app.patch('/todos/:id',(req,res)=>{
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
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((result)=>{
        if(!result){
            return res.status(404).send('Data Not found')
        }
        res.send({result});
    }).catch(e=> res.status(400).send()); 
})

//users post
app.post('/user',(req,res)=>{
    let body = _.pick(req.body,['email','password']);
    let user = new User(body);
    user.generateAuthToken().then((token)=>{
        res.header('x-auth',token).send(user)           
    }).catch((err)=>{
        res.status(400).send(err);
    })
    });


module.exports ={
    app};





