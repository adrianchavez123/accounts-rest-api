const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const mongodb = require('mongodb');

const url = "mongodb://localhost:27017/edx-course-db";
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

mongodb.MongoClient.connect(url, (error,db) => {
  if(error) return process.exit(1);

  app.get('/accounts', (req,res, next) =>{
    db.collection('accounts')
    .find({},{ sort : { _id : -1 } })
    .toArray((error,accounts)=>{
      if(error) return next(error);
      res.send(accounts);
    });
  });

  app.get('/accounts/:id', (req,res, next) =>{
    db.collection('accounts')
    .find({ _id : mongodb.ObjectID(req.params.id) } )
    .toArray((error,accounts)=>{
      if(error) return next(error);
      res.send(accounts);
    });
  });

  app.post('/accounts', (req,res, next) =>{
    let newAccount = req.body;
    db.collection('accounts').insert(newAccount, (error,results) =>{
      if(error) return next(error);
      res.send(results);
    });
  });

  app.put('/accounts/:id', (req,res, next) =>{
    db.collection('accounts')
    .update({_id : mongodb.ObjectID(req.params.id) },
    { $set : req.body },
    (error,results) =>{
      if(error) return next(error);
      res.send(results);
    });
  });

  app.delete('/accounts/:id', (req,res, next)=>{
    db.collection('accounts')
    .remove({ _id : mongodb.ObjectID(req.params.id) } , (error,results)=>{
      if(error) return next(error);
      res.send(results);
    });
  });

  app.use(errorHandler());
  app.listen(3000);
});
