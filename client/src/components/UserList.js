// Представляет список активных пользователей.
import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import { User } from './User'

export const UserList = (props) => {

  return (
    <ListGroup className="my-2">
      {props.users.map(user => (
        <User key={user.id} id={user.id} userName={user.name} mark={user.mark} markVisible={props.marksVisible}
          itsMe={props.currentUserName === user.name}></User>
      ))}
    </ListGroup>
  )
}
