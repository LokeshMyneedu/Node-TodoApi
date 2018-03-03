const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGODB_URI;         
                
                mongoose.Promise = global.Promise;
                mongoose.connect(MONGO_URI).then(() => {
                    console.log('Connected to Mongo instance.')
                }, (err) => {
                    console.log('Error connecting to Mongo instance: ', err);
                });
                
                module.export = { mongoose };