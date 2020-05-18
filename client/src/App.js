import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import List from './components/List'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

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
    <Container className="App">
      <form onSubmit={handleSumbitList}>
        <input 
          placeholder='List name..' 
          onChange={handleOnchangeList}
          value={value}
        />
        <button type='submit'>Add List</button>
      </form>
      <List list={list} update={update}/>
    </Container>
  );
}

export default App;
