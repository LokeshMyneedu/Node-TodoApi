const {SHA256} = require('crypto-js');

const bcrypt = require('bcryptjs');

let message = 'I am user number 3';

let hash = SHA256('message').toString();

let password = '123abc!';

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(hash)=>{
        console.log(hash);
    })
});

bcrypt.compare('123abc!','ab530a13e45914982b79f9b7e3fba994cfd1f3fb22f71cea1afbf02b460c6d1d',(err,res)=>{
    console.log(res);
})

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