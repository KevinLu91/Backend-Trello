const express = require('express');
const app = express();
const port = process.env.process || 8090;
const uuid = require('uuid'); 

const { getClient, getDB, createObjectId } = require('./db');
const { jsonParser, requestLog } = require('./Middleware/middleware')
const getCurrentDate = require('./utility/date');

app.use((req, res, next) => {
  jsonParser(req, res, next);
})

app.use((req, res, next) => {
  requestLog(req, res, next);
});

app.get('/trello', (req, res) =>{
  const db = getDB();
  db.collection('myCollection')
    .find({})
    .toArray()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    });
})

app.get('/trello/sort', (req, res) =>{
  getDB().collection('myCollection')
    .find()
    .sort({name: 1})
    .toArray()
    .then(data =>{
      res.status(200).send(data);
    })
    .catch((e) =>{
      console.error(e);
      res.status(500).end()
    })
})

app.get('/trello/list/:id', (req, res) =>{
  let id = req.params.id;

  if(!id){
    res.status(400).end();
    return;
  }

  getDB().collection('myCollection')
    .findOne({_id: createObjectId(id)})
    .then((result) =>{
      console.log(result)
      res.status(200).send(result)
    })
    .catch((e) =>{
      console.error(e)
      res.status(500).end();
    })
})

app.get('/trello/list/:listId/item/:itemId', (req, res) =>{
  let listId = req.params.listId;
  let itemId = req.params.itemId;

  if(!listId || !itemId){
    res.status(400).end();
    return;
  }
  let currentItem;

  getDB().collection('myCollection')
    .findOne({_id: createObjectId(listId)})
    .then((result) =>{
      for(const item of result.items){
        for(const property in item){
          if(item[property] === itemId){
            currentItem = item;
            res.status(200).send(currentItem)
          } 
        }
      }

      if(!currentItem){
        res.status(404).end();
            return;
      }
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

app.post('/trello/list/:id', (req, res) =>{
  let id = req.params.id;
  let body = req.body; 

  if(!id || !body.name){
    res.status(400).end();
    return;
  }
  
  getDB().collection('myCollection')
    .findOne({_id: createObjectId(id)})
    .then((result) =>{
      let name = body.name;
      let items = result.items;

      for(let i = 0; i<items.length; i++){
        items[i].id = uuid.v4();
      }
      
      return getDB().collection('myCollection')
        .insertOne({name, items})
        .then((result) =>{
          res.status(201).send();
        })
    })
    .catch((e) =>{
      console.error(e)
      res.status(500).end();
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


app.delete('/trello/list/:listId/item/:itemId', (req, res) =>{
  let listId = req.params.listId;
  let itemId = req.params.itemId; 
  
  if(!listId || !itemId){
    res.status(400).end();
    return;
  }
 
  getDB().collection('myCollection')
    .updateOne({_id: createObjectId(listId)},
      {$pull: {items: {id: itemId}}}
    )
    .then(() =>{
      res.status(204).end()
    })
    .catch((e) =>{
      console.log(e)
      res.status(500).end()
    })
})

app.patch('/trello/list/:listId/item/:itemId/edit', (req, res) =>{
  let listId = req.params.listId;
  let itemId = req.params.itemId;
  let body = req.body;

  if(!listId || !itemId || !body.value){
    res.status(400).end();
    return;
  }

  getDB().collection('myCollection')
    .updateOne({
      _id: createObjectId(listId),
      items: {
        $elemMatch: {id: itemId}
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

app.patch('/trello/list/:listId/item/:itemId/description', (req, res) =>{
  let listId = req.params.listId;
  let itemId = req.params.itemId;
  let body = req.body;

  if(!listId || !itemId || !body.value){
    res.status(400).end();
    return;
  }

  getDB().collection('myCollection')
    .updateOne({
      _id: createObjectId(listId),
      items: {
        $elemMatch: {id: itemId}
      }
    },{
      $set:{
        'items.$.description': body.value
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

app.patch('/trello/list/:listId/item/:itemId/move', (req, res) =>{
  let listId = req.params.listId;
  let itemId = req.params.itemId;
  let body = req.body; 
  
  if(!listId || !itemId || !body.item || !body.moveId
    || !body.item.title || !body.item.date || !body.item.id){
    res.status(400).end();
    return;
  }

  if(body.item.description !== '' && !body.item.description){
    res.status(400).end();
    return;
  }
  
  getDB().collection('myCollection')
    .updateOne({_id: createObjectId(listId)},
      {$pull: {items: {id: itemId}}}
    )
    .then(() =>{
      return getDB().collection('myCollection')
       .updateOne({_id: createObjectId(body.moveId)}, 
         {
          $push: {
            items: {
               $each: [body.item],
             }
          }
      })
      .then((result) =>{
        res.status(204).end()
      })    
    })
    .catch((e) =>{
      console.error(e)
      res.status(500).end()
    })
})

app.patch('/trello/list/move', (req, res) =>{
  let body = req.body;
  let newArray;

  console.log(body.new_index)
  console.log(body.old_index)

  if(body.new_index || body.new_index === 0 || 
    body.old_index || body.old_index === 0){
      getDB().collection('myCollection')
      .find({})
      .toArray()
      .then((result) =>{

      result.splice(body.new_index, 0, result.splice(body.old_index, 1)[0])
      newArray = result;   
      return getDB().collection('myCollection')
        .deleteMany({})
        .then(() =>{
          return getDB().collection('myCollection')
            .insertMany(newArray)
            .then((result) =>{
              res.status(201).send(result)
            })
        })     
      })
      .catch((e) =>{
        console.error(e);
        res.status(500).end();
      })
  } else{
    res.status(400).end();
    return;
  }
})

app.listen(port, () =>{
  console.log(`Started server on ${port}`)
})