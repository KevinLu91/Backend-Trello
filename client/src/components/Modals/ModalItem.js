import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  position: fixed; 
  z-index: 1; 
  padding-top: 100px; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.15); 

  .modal_container{
    position: relative;
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  .close {
    color: #aaaaaa;
    position:absolute;
    top:0;
    right:10px;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`

function ModalItem(props){
  const [editValue, setEditValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');

  function handleModual(){
    props.handleItemModul()
  }

  function handleDeleteItem(e){
    console.log(e.target.dataset.id)
    console.log(e.target.id)
    axios.delete(`/trello/item/${e.target.dataset.id}`, { data: { id: e.target.id }})
      .then((result) =>{
        props.update()
        props.handleItemModul()
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  function handleEditItem(e){
    axios.patch(`/trello/item/${e.target.dataset.id}/edit`, {id: e.target.id, value: editValue})
      .then((result) =>{
        console.log(result)
        props.update()
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  function handleDescription(e){
    axios.patch(`/trello/item/${e.target.dataset.id}/description`, {id: e.target.id, value: descriptionValue})
      .then((result) =>{
        console.log(result)
        props.update()
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  function handleEditOnChange(e){
    setEditValue(e.target.value)
  }

  function handleDescriptionOnChange(e){
    setDescriptionValue(e.target.value)
  }



  return(
    <Container>
      <div className='modal_container'>
        <h3>Item Name:</h3>{editValue ? <p>{editValue}</p> : <p>{props.itemName}</p>}
        <textarea rows="4" cols="50" onChange={handleDescriptionOnChange} value={descriptionValue}></textarea>
        <button data-id={props.listId} id={props.itemId} onClick={handleDescription}>Save</button>
        <button data-id={props.listId} id={props.itemId} onClick={handleDeleteItem}>Delete</button>
        <input type='text'onChange={handleEditOnChange} placeholder='Change item name..'/> 
        <button data-id={props.listId} id={props.itemId} onClick={handleEditItem}>Edit</button>
        <span className="close" onClick={handleModual}>&times;</span>
      </div>
    </Container>
  )
}

export default ModalItem;