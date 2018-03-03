const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
 if(err){
    return console.log('unable to connect to MongoDB server');
 }
 console.log('connected to MongoDB server');
db.collection('Todos').find({
    _id:new ObjectID('5a9a25c9cafc742938119226')})
    .toArray().then((doc)=>{ //return cursors pointer to data
 console.log('Todos');
 console.log('data from mongo',JSON.stringify(doc,undefined,2));
}).catch((err)=>{
   console.log('error in fetching data',err);
 })

 db.collection('Todos').find({
    _id:new ObjectID('5a9a25c9cafc742938119226')})
    .count().then((count)=>{ //return cursors pointer to data
 console.log(`Todos:${count}`); 
}).catch((err)=>{
   console.log('error in fetching data',err);
 })

});