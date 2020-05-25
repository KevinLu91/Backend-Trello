import React from 'react';
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
    width: 30%;
    heihgt: 20%;
  }

  .button_container{
    display: flex;
    justify-content: space-between;
  }

  button{
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

function ModalDeleteLists(props){

  function handleCancel(e){
    e.stopPropagation();
    props.handleDeleteAll()
  }

  function handeDelete(){
    axios.delete('/trello/lists')
      .then(() =>{
        props.handleDeleteAll()
        props.update()
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  return(
    <Container>
      <div className='modal_container'>
        <h3>Are you sure that you want to delete all lists?</h3>
        <div className='button_container'>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handeDelete}>Yes!</button>
        </div>
      </div>
    </Container>
  )
}

export default ModalDeleteLists;