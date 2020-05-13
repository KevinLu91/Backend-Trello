import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import List from './components/List'

function App() {
  const [value, setValue] = useState('');
  const [list, setList] = useState('');
  const [useUpdate, setUseUpdate] = useState(0);
  
  useEffect(() =>{
    axios.get('/trello')
      .then((data) =>{
        console.log(data.data)
        setList(data.data)
      })
      .catch((e) =>{
        console.log(e)
      })
  }, [useUpdate])

  function update(){
    setUseUpdate(useUpdate+1)
  }

  function handleOnchangeList(e) {
    setValue(e.target.value);
  }

  function handleSumbitList(e) {
    e.preventDefault();

    axios.post('/trello/list', {name: value, items: []})
      .then(() =>{
        setValue('');
        update()
      })
      .catch((e) =>{
        console.log(e);
      })
  }

  return (
    <div className="App">
      <form onSubmit={handleSumbitList}>
        <input 
          placeholder='List name..' 
          onChange={handleOnchangeList}
          value={value}
        />
        <button type='submit'>Add List</button>
      </form>
      <List list={list} update={update}/>
    </div>
  );
}

export default App;
