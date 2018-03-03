//deleteMany
//deleteone
//findoneanddelete

const {MongoClient,ObjectID} = require('mongodb');


// MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
//  if(err){
//     return console.log('unable to connect to MongoDB server');
//  }
//  console.log('connected to MongoDB server');
// db.collection('Todos').deleteMany({text:'Eat Lunch'}).then((result)=>{ //return cursors pointer to data
//     console.log(`Deleted Items:${result}`); 
//    }).catch((err)=>{
//       console.log('error in fetching data',err);
//     })

 //deleteone
//  MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
//     if(err){
//        return console.log('unable to connect to MongoDB server');
//     }
//     console.log('connected to MongoDB server');
//    db.collection('Todos').deleteOne({text:'Eat Lunch'}).then((result)=>{ //return cursors pointer to data
//        console.log(`Deleted Items:${result}`); 
//       }).catch((err)=>{
//          console.log('error in fetching data',err);
//        })  
   //findoneanddelete 
   
   MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
       return console.log('unable to connect to MongoDB server');
    }
    console.log('connected to MongoDB server');
   db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{ //return cursors pointer to data
       console.log(result); 
      }).catch((err)=>{
         console.log('error in fetching data',err);
       })

});