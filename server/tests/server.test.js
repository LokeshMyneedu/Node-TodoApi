const expect = require('expect');
const request = require('supertest');
const{ObjectID}= require('mongodb');

const {app} = require('./../server');
const {Todo}= require('./../models/todo');

const todos =[{
    _id: new ObjectID(),
     text:'first test'
},{
    _id: new ObjectID()
,    text:'second test'
}]

beforeEach((done)=>{
    Todo.remove({}).then(()=>{return Todo.insertMany(todos)}).then(()=>done());
});

describe('post/todos',()=>{
    it('should create new to do',(done)=>{
        var text ='test todo text';
        request(app).post('/todos').send({
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
        request(app).post('/todos').send({
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
        request(app).get('/todos').expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        }).end(done);     
    })
})

describe('Get/todos/id',()=>{
    it('should return doc by passing valid id',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
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
        .expect(404)         
        .end(done);
        }),
    it('should return 400 by passing corrupted id',(done)=>{
            request(app)
            .get(`/todos/123`)
            .expect(404)         
            .end(done);
            })    
})