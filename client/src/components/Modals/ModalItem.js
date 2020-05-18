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

  .modal_close {
    color: #aaaaaa;
    position:absolute;
    top:-10px;
    right:1px;
    font-size: 28px;
    font-weight: bold;
  }
  
  .modal_close:hover,
  .modal_close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }

  .modal_header{
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: lightgrey;
    margin-bottom: 15px;

    input{
      height: 27px;
    }
  }

  .modal_main{
    display: flex;
    justify-content: start;
  }

  .textarea_container{
    display:flex;
    width: 50%;
    flex-direction: column;
    margin-right: 50px;
  }

  .modal_footer{
    display:flex;
    justify-content: flex-end;
  }

  .move_container{
    select{
      height: 33px;
    }
  }

  button{
    background-color: #008CBA;
    border: none;
    cursor: pointer;
    color: white;
    padding: 10px 25px;
    height: 33px;
    width: 75px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
  }
  
`

function ModalItem(props){
  const [editValue, setEditValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [item, setItem] = useState('');
  const [moveId, setMoveId] = useState(null);

  useEffect(() =>{
    axios.get(`/trello/list/${props.listId}/item/${props.itemId}`)
      .then((result) =>{
        setItem(result.data)
        console.log(result.data)
      })
      .catch((e) =>{
        console.log(e)
      })
  }, [])

  

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
    axios.patch(`/trello/list/${e.target.dataset.id}/item/${e.target.id}/edit`, {value: editValue})
      .then((result) =>{
        props.update()
        props.handleItemModul()
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  function handleDescription(e){
    axios.patch(`/trello/list/${e.target.dataset.id}/item/${e.target.id}/description`, {value: descriptionValue})
      .then((result) =>{
        console.log(result)
        props.handleItemModul()
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  function handleMove(e){
    axios.patch(`/trello/list/${props.listId}/item/${props.itemId}/move`, {item, moveId: moveId})
      .then((result) =>{
        console.log(result)
        props.update()
        props.handleItemModul()
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

  function handleMoveOnChange(e){
    let index = e.target.selectedIndex;
    let optionElement = e.target.childNodes[index]
    let optionId =  optionElement.getAttribute('data-id');
    setMoveId(optionId)
    console.log("titta", optionId)
  }

  return(
    <Container>
      <div className='modal_container'>
        <div className='modal_header'>
          <h3>Item Name:</h3>{editValue ? <p>{editValue}</p> : <p>{props.itemName}</p>}
          <div className='input_container'>
            <input type='text'onChange={handleEditOnChange} placeholder='Change item name..'/> 
            <button data-id={props.listId} id={props.itemId} onClick={handleEditItem}>Edit</button>
          </div>
        </div>
        <div className='modal_main'>
          <div className='textarea_container'>
            <textarea rows="5" cols="30" onChange={handleDescriptionOnChange} defaultValue={item.description}></textarea>
            <button data-id={props.listId} id={props.itemId} onClick={handleDescription}>Save</button>
          </div>
          <div className='move_container'>
            <select onChange={handleMoveOnChange}>
              <option>--Please choose a move option--</option>
              {props.list.map( x=>(
                <option key={x._id} data-id={x._id}>
                  {x.name}
                </option>
              ))}
            </select>
              <button onClick={handleMove}>Move</button>
          </div>
        </div>
        <div className='modal_footer'>
          <button data-id={props.listId} id={props.itemId} onClick={handleDeleteItem}>Delete</button>
        </div>
        
        <span className="modal_close" onClick={handleModual}>&times;</span>
      </div>
    </Container>
  )
}

export default ModalItem;