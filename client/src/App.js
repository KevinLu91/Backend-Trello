import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import List from './components/List'
import ModalDeleteLists from './components/Modals/ModalDeleteLists';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(0,174,204);
  min-height: 100vh;

  .list_header{
    display: flex;
    align-items: baseline;

    .deleteList_btn{
      background-color: rgb(4,122,143);
      color: white;
      border: none;
      cursor: pointer;
      padding-bottom: 25px;
      padding-top: 11px;
      height: 33px;
      width: 75px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 12px;
      margin-left: 10px;
    }
  }

  .list_input{
    height:30px;
    margin-top:15px;
  }

  .addList_btn{
    background-color: rgb(4,122,143);
    color: white;
    border: none;
    cursor: pointer;
    padding-bottom: 25px;
    padding-top: 11px;
    height: 33px;
    width: 75px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
  }
`

function App() {
  const [value, setValue] = useState('');
  const [list, setList] = useState('');
  const [useUpdate, setUseUpdate] = useState(0);
  const [sort, setSort] = useState(false);
  const [modalDeleteAll, setModalDeleteAll] = useState(false)
  
  useEffect(() =>{

    if(sort){
      axios.get('/trello/sort')
      .then((data) =>{
        setList(data.data)
      })
      .catch((e) =>{
        console.log(e)
      })
    } else {
      axios.get('/trello')
      .then((data) =>{  
        setList(data.data)
      })
      .catch((e) =>{
        console.log(e)
      })
    }

  }, [useUpdate, sort])

  function handleSortByName(){
    setSort(!sort)
  }

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

  function handleDeleteAll(){
    setModalDeleteAll(!modalDeleteAll)
  }

  return (
    <Container className="App">
      <div className='list_header'>
        <form onSubmit={handleSumbitList}>
          <input 
            placeholder='List name..' 
            onChange={handleOnchangeList}
            value={value}
            className='list_input'
          />
          <button className='addList_btn'type='submit'>Add List</button>
        </form>
        <button className='deleteList_btn' onClick={handleDeleteAll}>Delete all </button>
      </div>
      {modalDeleteAll ? <ModalDeleteLists handleDeleteAll={handleDeleteAll} update={update}/> : null}
      <List 
        list={list} 
        update={update} 
        handleSortByName={handleSortByName}
        sort={sort}
        
      />
    </Container>
  );
}

export default App;
