const jwt = require('jsonwebtoken');

jwt.sign //creates the token
jwt.verify // verifies the token

let data ={
    id:4
}

let hash = jwt.sign(data,'secret code');

console.log(hash);

var decoded = jwt.verify(hash,'secret code');

console.log(decoded);