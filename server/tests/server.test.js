const expect = require('expect');
const request = require('supertest');
const{ObjectID}= require('mongodb');

const{User}=require('./../models/user');
const {app} = require('./../server');
const {Todo}= require('./../models/todo');
const {todos,populateTodos,populateUsers,users}= require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('post/todos',()=>{
    it('should create new to do',(done)=>{
        var text ='test todo text';
        request(app).post('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .send({
            text}).expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
               if(err){
                 return done(err);
               }
               Todo.find({text}).then((todos)=>{
                   expect(todos.length).toBe(1);
                   expect(todos[0].text).toBe(text);
                   done();
               }).catch((e)=>done(e));
            });
    })

    it('should not create new to do with invalid data',(done)=>{
        var text ='';
        request(app).post('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .send({
            text
        }).expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);              
                done();
            }).catch((e)=>done(e));
        })
    })
})

describe('Get/todos',()=>{
    it('should get the data from database',(done)=>{
        request(app)
        .get('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1);
        }).end(done);     
    })
})

describe('Get/todos/id',()=>{
    it('should return doc by passing valid id',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
     .expect((res)=>{
        expect(res.body.result.text).toBe(todos[0].text);
     })
    .end(done);
    }),
    it('should return 404 by passing newly created id',(done)=>{
        var hexId =new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)         
        .end(done);
        }),
    it('should return 400 by passing corrupted id',(done)=>{
            request(app)
            .get(`/todos/123`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)         
            .end(done);
            }) ,
     it('should not return doc by passing valid id created by other user',(done)=>{
            request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)            
            .end(done);
            })           
})

describe('Delete/todos/id',()=>{
    it('should remove doc by passing valid id',(done)=>{
        let hexId= todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth',users[1].tokens[0].token)
    .expect(200)
     .expect((res)=>{
        expect(res.body.result.text).toBe(todos[1].text);
     })
    .end((err,res)=>{
        if(err){
            return done(err);
        }
        Todo.findById(hexId).then((todo)=>{
            expect(todo).toNotExist();
            done();
        }).catch((e)=>done(e));
    });
    }),
    it('should return 404 by passing newly created id',(done)=>{
        var hexId =new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)         
        .end(done);
        }),
    it('should return 400 by passing corrupted id',(done)=>{
            request(app)
            .delete(`/todos/123`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)         
            .end(done);
            }),
    it('should not  remove doc by passing valid id of other users',(done)=>{
                let hexId= todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)        
        .end((err,res)=>{
        if(err){
            return done(err);
         }
        Todo.findById(hexId).then((todo)=>{
                    expect(todo).toExist();
                    done();
        }).catch((e)=>done(e));
        });
        })            
})

describe('patch/todos/id',()=>{
    it('should update the todo',(done)=>{
    request(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .send({
        completed:true
    })
    .expect(200)
     .expect((res)=>{
        expect(res.body.result.completed).toBe(true),
        expect(res.body.result.completedAt).toBeA('number');
     })
    .end(done);
    }),
    it('should not update the todo created by other user',(done)=>{
        request(app)
        .patch(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .send({
            completed:true
        })
        .expect(404)
        .end(done);
        }),
    it('should update the todo completed at to null by making completed false',(done)=>{
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .send({
            completed:false
        })
        .expect(200)
         .expect((res)=>{
            expect(res.body.result.completedAt).toBe(null),
            expect(res.body.result.completed).toBe(false)

         })
        .end(done);
        }),
    it('should return 404 by passing newly created id',(done)=>{
        var hexId =new ObjectID().toHexString();
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)         
        .end(done);
        }),
    it('should return 400 by passing corrupted id',(done)=>{
            request(app)
            .patch(`/todos/123`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)         
            .end(done);
            })    
});

describe('Get/users/me',()=>{
    it('should return user if authenticated',(done)=>{
       request(app)
       .get('/user/me')
       .set('x-auth',users[0].tokens[0].token)
       .expect(200)
       .expect((res)=>{
           expect(res.body._id).toBe(users[0]._id.toHexString());
           expect(res.body.email).toBe(users[0].email);
       })
       .end(done);
    });
    it('should return 401 if not authenticated',(done)=>{
        request(app)
       .get('/user/me')       
       .expect(401) 
       .expect((res)=>{
        expect(res.body).toEqual({});       
    })     
       .end(done);
    });
});

describe('Post/users',()=>{
    it('should create a user',(done)=>{       
         let email ='testlokesh@gmail.com';
         let password ='test@1234';
        request(app)
        .post('/user')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body.email).toBe(email);                        
        })
        .end((err)=>{
            if(err){
               return done(err);
            }
           User.findOne({email}).then((user)=>{
               expect(user).toExist();
               expect(user.password).toNotBe(password);
               done();
           }).catch((e)=>done(e));
        });
    });
    it('should return validation errors if request invalid',(done)=>{
        let email ='testlokeshgmail.com';
        let password ='t';
       request(app)
       .post('/user')
       .send({email,password})
       .expect(400)
       .expect((res)=>{
        expect(res.headers['x-auth']).toNotExist();                       
    })
    .end(done);
    });

    it('should not create use if email is already used',(done)=>{
        let email =users[0].email;
        let password ='test@1234';
       request(app)
       .post('/user')
       .send({email,password})
       .expect(400)
       .expect((res)=>{
        expect(res.headers['x-auth']).toNotExist();                            
    })
    .end(done);
    });
})


describe('Post/user/login',()=>{
  it('should login user and return auth token',(done)=>{
      let email= users[1].email;
      let password = users[1].password;
   request(app)
   .post('/user/login')
   .send({
    email,
    password
   })
   .expect(200)
   .expect((res)=>{
       expect(res.body.email).toBe(users[1].email);
       expect(res.headers['x-auth']).toExist();
   }).end((err,res)=>{
       if(err){
           return done(err);
       }
       User.findById(users[1]._id).then((user)=>{
           expect(user.tokens[1]).toInclude({
               access:'auth',
               token:res.headers['x-auth']
           });
           done();
       }).catch((e)=>done(e));
   });
  });
  it('should reject invalid login',(done)=>{
    let email= 'VVV@VV.com';
      let password = users[1].password;
   request(app)
   .post('/user/login')
   .send({
    email,
    password
   })
   .expect(400)
   .expect((res)=>{       
       expect(res.headers['x-auth']).toNotExist();
   }).end((err,res)=>{
    if(err){
        return done(err);
    }
    User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(1);
        done();
    }).catch((e)=>done(e));
  });  
  });});

  describe('Delete /user/me/token',(done)=>{
      it('should remove auth token on logged out',(done)=>{
          request(app)
          .delete('/user/me/token')
          .set('x-auth',users[0].tokens[0].token)
          .expect(200)
           .end((err,res)=>{
           if(err){
               return done(err);
           }
           User.findById(users[0]._id).then((user)=>{
            expect(user.tokens.length).toBe(0);
            done();
      }).catch((e)=>done(e));
  })
      })
    })