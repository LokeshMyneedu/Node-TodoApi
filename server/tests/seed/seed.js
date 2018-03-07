const {ObjectID}= require('mongodb');
const {Todo}= require('./../../models/todo');
const {User}= require('./../../models/user');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const todos =[{
    _id:new ObjectID(),
     text:'first test',
     _creator:userOneId
},{
    _id: new ObjectID(),
    text:'second test',
     completed:true,
     completedAt:333,
     _creator:userTwoId
}];

const users =[{
_id:userOneId,
email:'test@test.com',
password:'userOnePass',
tokens:[{
    access:'auth',
    token:jwt.sign({
        _id:userOneId,access:'auth'
       },process.env.JWT_SECRET).toString()
}]
},{
    _id:userTwoId,
    email:'test1@test.com',
    password:'userOnePass',
    tokens:[{
        access:'auth',
        token:jwt.sign({
            _id:userTwoId,access:'auth'
           },process.env.JWT_SECRET).toString()
    }]
}]


const populateTodos=(done)=>{
    Todo.remove({}).then(()=>{return Todo.insertMany(todos)}).then(()=>done());
};

const populateUsers =(done)=>{
    User.remove({}).then(()=>{
  let userOne = new User(users[0]).save();
  let userTwo = new User(users[1]).save();
  return Promise.all([userOne,userTwo])}).then(()=>done())    
};

module.exports ={
    todos,
    populateTodos,
    populateUsers,
    users
};