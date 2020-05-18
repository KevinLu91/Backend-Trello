import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CreateIcon from '@material-ui/icons/Create';

import ModalItem from './Modals/ModalItem';
import ListDropdown from './ListDropdown';
import ListAddItem from './ListAddItem';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  .list_container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 15px;
    min-height: 300px;
    background: rgb(235,236,240);
  }

  .list_header{
    display: flex;
    justify-content: space-between;
    margin-left: 15px;
  }

  .list_main{
    margin-left: 15px;

    .item_container{
      background: white;
      padding: 5px;
      margin-bottom: 10px;
      margin-right: 15px;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
    }

    .item_btn{
      border: none;
      background: white;
      cursor: pointer;

      :hover{
        background: rgba(9,30,66,.25);
      }
    }
  }

  .list_footer{

  }

`

function List(props){
  const [itemModal, setItemModal] = useState(false);
  const [listId, setListId] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');

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
      {props.list ? props.list.map( x =>(
        <div className='list_container' key={x._id}>
          <div className='list_header' >
            <h3>{x.name}</h3>
            <ListDropdown 
              name={x.name}
              id = {x._id}
              update = {props.update}
            />
          </div>   
          <div className='list_main'>
              {x.items.map(y =>(
                <div key={y.id} className='item_container'>
                  {y.title}
                  <button 
                     className='item_btn'
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
                    list={props.list}
                  /> : null}       
                </div>
              ))}
          </div>
          <div className='list_footer'>
            <ListAddItem 
              id = {x._id}
              update = {props.update}
            />
          </div>
        </div>
      )) : <p>Loading...</p>}
    </Container>
  )
}

export default List;