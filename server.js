const express = require('express');
const app = express();
const port = process.env.process || 8090;
const uuid = require('uuid');

const { getClient, getDB, createObjectId } = require('./db');
const getCurrentDate = require('./utility/date');

app.use((req, res, next) => {
  let body = "";
  if (req.is("json")) {
    req.on("data", (chunk) => {
      body += chunk;
    })

    req.on("end", () => {
      try {
        req.body = JSON.parse(body);

        next();

      } catch (e) {
        res.status(404).end();
      }
    })
  } else {
    next();
  }
})

app.use((req, res, next) => {
  let start = Date.now();
  res.once('finish', () => {
    let end = Date.now();
    let timeTook = end - start;
    console.log(req.method, req.path, res.statusCode, timeTook + 'ms');
  });
  next();
});

app.get('/trello', (req, res) =>{
  const db = getDB();
  db.collection('myCollection')
    .find({})
    .toArray()
    .then(data => {
      res.send(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
})

app.get('/trello/list/:id/item', (req, res) =>{
  let id = req.params.id;

  if(!id){
    res.status(400).end();
    return;
  }

  getDB().collection('myCollection')
    .findOne({_id: createObjectId(id)})
    .then((result) =>{
      res.status(200).send(result)
    })
    .catch((e) =>{
      console.error(e)
      res.status(500).end();
    })
})

app.post('/trello/list', (req, res) =>{
  let body = req.body; 

  if(!body.items || !body.name){
    res.status(400).end();
    return;
  }

  getDB().collection('myCollection')
    .insertOne(body)
    .then((result) =>{
      res.status(201).send(body);
    })
    .catch((e) =>{
      console.error(e);
      res.status(500).end();
    })
})

app.post('/trello/list/:id/item', (req, res) =>{
  let body = req.body;
  let id = req.params.id;
  let user;
  
  body.date = getCurrentDate();
  body.id = uuid.v4();

  if(!id || !body.title || body.description !== ''){
    res.status(400).end();
    return;
  }

  getDB().collection('myCollection')
    .updateOne({_id: createObjectId(id)}, 
      {
        $push: {
          items: {
            $each: [body],
          }
        }
    })
    .then((result) =>{
      res.status(201).send(body)
    })
    .catch((e) =>{
      console.error(e)
      res.status(500).end()
    })
})

app.delete('/trello/list/:id', (req, res) =>{
  let id = req.params.id;

  if(!id){
    res.status(400).end();
    return;
  }

  getDB().collection('myCollection')
    .deleteOne({_id: createObjectId(id)})
    .then(() =>{
      res.status(204).end()
    })
    .catch((e) =>{
      console.error(e)
      res.status(500).end();
    })
})


app.delete('/trello/item/:id', (req, res) =>{
  let id = req.params.id;
  let body = req.body 
  
  if(!id || !body.id){
    res.status(400).end();
    return;
  }
 
  getDB().collection('myCollection')
    .updateOne({_id: createObjectId(id)},
      {$pull: {items: {id: body.id}}}
    )
    .then(() =>{
      res.status(204).end()
    })
    .catch((e) =>{
      console.log(e)
      res.status(500).end()
    })
})

app.patch('/trello/item/:id', (req, res) =>{
  let id = req.params.id;
  let body = req.body;

  if(!id || !body.id || !body.value){
    res.status(400).end();
    return;
  }

  getDB().collection('myCollection')
    .updateOne({
      _id: createObjectId(id),
      items: {
        $elemMatch: {id: body.id}
      }
    },{
      $set:{
        'items.$.title': body.value
     }
    })
    .then((result) =>{
      res.status(200).send({result: true})
    })
    .catch((e) =>{
      console.error(e);
      res.status(500).end();
    })
})



app.listen(port, () =>{
  console.log(`Started server on ${port}`)
})