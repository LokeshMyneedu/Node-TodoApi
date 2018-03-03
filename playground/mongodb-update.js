const {MongoClient,ObjectID} = require('mongodb'); 
   
   MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
       return console.log('unable to connect to MongoDB server');
    }
    console.log('connected to MongoDB server');
   db.collection('Todos').findOneAndUpdate({_id:new ObjectID('5a9aa3321f3ab6af555130d9')},{
       $set:{
           completed:true
       }},{
           returnOriginal:false       
    }
   ).then((result)=>{ //return cursors pointer to data
       console.log(result); 
      }).catch((err)=>{
         console.log('error in fetching data',err);
       })

       db.collection('Users').findOneAndUpdate({_id:new ObjectID('5a9a279dda5a7c2faccaed0e')},{
        $set:{
            name:'Lokesh Myneedu'
        },$inc:{
            age:1
        }},{
            returnOriginal:false       
     }
    ).then((result)=>{ //return cursors pointer to data
        console.log(result); 
       }).catch((err)=>{
          console.log('error in fetching data',err);
        })   

});