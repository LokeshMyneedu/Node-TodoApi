const{ObjectID}= require('mongodb');

var {mongoose}=require('./../server/db/mongoose');
const {Todo}= require('./../server/models/todo');

var id ='5a9aed4eb682155838c1fa1b';

ObjectID.isValid(id);//to check for id validation

Todo.find({
    _id:id
}).then((results)=>{
    console.log('results',results);
});


Todo.findOne({
    _id:id
}).then((res)=>{
    console.log('result',res);
});

Todo.findById(id).then((res)=>{
    if(!res){
        return console.log('Id not found');
    }
    console.log('result',res);
}).catch((e)=>console.log(e));