const {MongoClient,ObjectID} = require('mongodb');
// var obj = new ObjectID();
// console.log(obj);//object printing

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
 if(err){
    return console.log('unable to connect to MongoDB server');
 }
 console.log('connected to MongoDB server');
//  db.collection('Todos').insertOne({
//    text:'something to do',
//    completed:false
//  },(err,result)=>{
//      if(err)
//      {
//         return console.log('unable to insert Todo',err); 
//      }
//      console.log(JSON.stringify(result.ops,undefined,2));

//  })
//  db.close();

// db.collection('Users').insertOne({
//     name:'Lokesh',
//     age:27,
//     location:'8505 Ashley hill Court'
// },(err,result)=>{
//     if(err){
//         return console.log('unable to insert User',err);
//     }
//     console.log(JSON.stringify(result.ops,undefined,2));
//     console.log(result.ops[0]._id.getTimestamp());
// })

// db.close();
  });
 //12 byte value
 //object id contains time stamp 4 byte moment of id created
 //3 bytes machine identifier unique
 //2 byte process id
 //3 bytecounter(random value)
 //unique

 //object destrucring in ES6 we are pulling one property of object into variable

 var user ={
    name:'lokesh',
    age:25
}

var {name} =user;
console.log(name);