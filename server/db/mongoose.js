const mongoose = require('mongoose');
const REMOTE_MONGO = 'mongodb://nmyneedu:Khajaguda_6@ds155288.mlab.com:55288/todo-app-api2';
                const LOCAL_MONGO = 'mongodb://localhost:27017/TodoApp';
                const MONGO_URI = process.env.PORT ? REMOTE_MONGO : LOCAL_MONGO;
                
                mongoose.Promise = global.Promise;
                mongoose.connect(MONGO_URI).then(() => {
                    console.log('Connected to Mongo instance.')
                }, (err) => {
                    console.log('Error connecting to Mongo instance: ', err);
                });
                
                module.export = { mongoose };