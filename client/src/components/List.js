import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CreateIcon from '@material-ui/icons/Create';

import ModalItem from './Modals/ModalItem';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  .list_container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 15px;
    min-height: 300px;
    background: lightgrey;
  }

  .list_header{
    display: flex;
  }

  .list_footer{
    
   

  }
`

function List(props){
  const [value, setvalue] = useState('');
  const [itemModal, setItemModal] = useState(false);
  const [listId, setListId] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');

  function handleDeleteList(e) {
    axios.delete(`/trello/list/${e.target.dataset.id}`)
      .then((result) =>{
        props.update()
      })
      .catch((e) =>{
       console.log(e);
      })
  }

  function handleList(e){
    axios.get(`/trello/list/${e.target.dataset.id}/item`)
      .then((result) =>{
        console.log(result)
        props.update()
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  function handleItemOnchange(e){
    setvalue(e.target.value)
  }

  function handleAddItem(e){
    e.preventDefault(e)
    axios.post(`/trello/list/${e.target.dataset.id}/item`, {
      title: value, 
      description: '',
    })
      .then((result) =>{
        props.update()
        setvalue('')
      })
      .catch((e) =>{
        console.log(e)
      })
  }

  function handleItemModul(e){
    setItemModal(!itemModal);

    if(!itemModal){
      setListId(e.target.dataset.id)
      setItemId(e.target.id)
      setItemName(e.target.dataset.user)
    }
  }
  

  return(
    <Container>
      {props.list.length === 0 ? <p>No list, Please create a list</p> : null}
      {props.list ? props.list.map(x =>(
        <div className='list_container' key={x._id}>
          <div className='list_header'>
            <h3>{x.name}</h3>
            <button data-id={x._id} onClick={handleDeleteList}>Delete</button>
            <button data-id={x._id} onClick={handleList}>info</button>
          </div>
          <div className='list_main'>
              {x.items.map(y =>(
                <div key={y.id}>
                  {y.title}
                  <button 
                     onClick={handleItemModul}
                     data-id={x._id}
                     id={y.id}
                     data-user={y.title}
                  >
                    <CreateIcon 
                    style={{ 
                    paddingLeft: '5px',
                     fontSize: "small", 
                     cursor:'pointer',
                     pointerEvents:'none'
                     }}
                  />
                  </button>         
                  {itemModal ? <ModalItem 
                    handleItemModul={handleItemModul}
                    listId={listId}
                    itemId={itemId}
                    itemName={itemName}
                    update={props.update}
                  /> : null}       
                </div>
              ))}
          </div>
          <div className='list_footer'>
            <form>
              <input 
                type='text' 
                onChange={handleItemOnchange}
                value={value}
                placeholder= 'Add item..'
              />
              <button data-id={x._id} onClick={handleAddItem} type='submit'>Add item</button>
            </form>
          </div>
        </div>
      )) : <p>Loading...</p>}
    </Container>
  )
}

export default List;