const {SHA256} = require('crypto-js');

let message = 'I am user number 3';

let hash = SHA256('message').toString();

console.log(`message :${message}`);

console.log(`Hash value :${hash}`);

let data ={
    id:4
}

let token = {
    data,
    hash:SHA256(JSON.stringify(data)+'some secret').toString()
}

let resultHash = SHA256(JSON.stringify(data)+'some secret').toString();

if(resultHash === token.hash){
    console.log('toke is not modified');
}else{
    console.log('data was changed');
}