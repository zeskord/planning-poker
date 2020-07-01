// Представляет список активных пользователей.
import React, { Component } from 'react';
import { ListGroup } from 'bootstrap-4-react';
import User from './User'

export default class UserList extends Component {
  
  
  render() {
    return (
      <ListGroup my="2">
        <User value="Пользователь 1" ></User>
        <User value="Пользователь 2" ></User>
        <User value="Пользователь 3" ></User>
      </ListGroup>
    )
  }
}