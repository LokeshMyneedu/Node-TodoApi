const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<nmyneedu>:<Khajaguda@6>@ds155288.mlab.com:55288/todo-app-api2');

module.exports ={
    mongoose
};