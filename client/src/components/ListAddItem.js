import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.form`

  input{
    height: 30px;
  }

  button{
    background-color: #008CBA;
    color: white;
    border: none;
    cursor: pointer;
    padding-bottom: 25px;
    padding-top: 10px;
    height: 30px;
    width: 75px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
  }
`

function ListAddItem(props){
  const [value, setValue] = useState('');

  function handleItemOnChange(e) {
    setValue(e.target.value)
  }

  function handleAddItem(e){
    e.preventDefault(e)
    axios.post(`/trello/list/${e.target.dataset.id}/item`, {
      title: value, 
      description: '',
    })
      .then((result) =>{
        props.update()
        setValue('')
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  return(
    <>
      <Container>
        <input 
        type='text' 
        onChange={handleItemOnChange}
        value={value}
        placeholder= 'Add item..'
      />
       <button data-id={props.id} onClick={handleAddItem} type='submit'>Add item</button>
      </Container>
    </>
  )
}

export default ListAddItem;

