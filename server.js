const express = require('express');
const app = express();
const port = process.env.process || 8090;

const { getClient, getDB } = require('./db');

app.get('/', (req, res) =>{
  getDB().collection('myCollection')
    .find({})
    .toArray()
    .then((data) =>{
      console.log(data)
    })
})


app.listen(port, () =>{
  console.log(`Started server on ${port}`)
})