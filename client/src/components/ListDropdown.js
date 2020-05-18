import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import useOutsideClick from "../utility/useOutsideClick";

const Container = styled.div`
  position: relative;
  display: inline-block;

  .dropdown_btn {
    background-color: #008CBA;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
  }

  .dropdown_content{ 
    position: absolute;
    min-width: 160px;
    background: white;
    border-radius: 2px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    display:flex;
    flex-direction: column;
  }

  .dropdown_header{
    display:flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 10px 0px 10px;

    color: rgb(149,158,174);
    border-bottom: 1px solid rgb(149,158,174);

    span{
      font-size: 20px;
      :hover,
      :focus{
        color: #000;
        text-decoration: none;
        cursor: pointer;
      }
    }
  }

  .droppdown_main{
    margin: 10px;

    p{
      padding: 16px;

      :hover{
        background: rgb(235,236,240);
        cursor pointer;
      }
    }
  }

  .copy_container{
    border-top: 1px solid rgb(149,158,174);
    
    input{
      margin: 10px;
      height: 30px;
    }
  }

`

function ListDropdown(props){
  const [value, setValue] = useState('');
  const [dropdown, setDropdown] = useState( false);
  const ref = useRef();

  useOutsideClick(ref, () =>{
    if(dropdown){
      setDropdown(false);
    }
  })

  function handleList(e){
    axios.get(`/trello/list/${e.target.dataset.id}`)
      .then((result) =>{
        console.log(result)
        props.update()
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  function handleDeleteList(e) {
    axios.delete(`/trello/list/${e.target.dataset.id}`)
      .then((result) =>{
        props.update()
      })
      .catch((e) =>{
       console.log(e);
      })
  }
  
  function handleCopy(e){
    axios.post(`/trello/list/${e.target.dataset.id}`, {name: value})
    .then((result) =>{
      setValue('');
      props.update();
      handeMenu();
    })
    .catch((e) =>{
      console.log(e)
    })
  }

  function handleListOnChange(e){
    setValue(e.target.value)
  }

  function handeMenu() {
    setDropdown(!dropdown)
   
  }
  
  return(
    <Container>
        <button className='dropdown_btn' onClick={handeMenu}>  ... </button>
        {dropdown ? <div className='dropdown_content' ref={ref} >
          <div className='dropdown_header'>
            <p>List Actions</p>
            <span onClick={handeMenu}>&times;</span>
          </div>
          <div className='droppdown_main'>
            <p data-id={props.id} onClick={handleList} >info</p>
            <p data-id={props.id} onClick={handleDeleteList} >Delete list</p>
            <div className='copy_container'>
              <p data-id={props.id} onClick={handleCopy}>Copy:</p>
              <input type='text' placeholder='New list name.. ' id={props.id} value={value} onChange={handleListOnChange}/>
            </div>
          </div>
          
        </div>: null}
        
    </Container>
  )
}

export default ListDropdown;
