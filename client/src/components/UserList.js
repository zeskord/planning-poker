// Представляет список активных пользователей.
import React, { Component } from 'react';
import { ListGroup } from 'bootstrap-4-react';
import User from './User'

export default class UserList extends Component {

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <ListGroup my="2">
        {this.props.users.map(user => (
          <User key={user.id} userName={user.name} mark={user.mark} markVisible={this.props.marksVisible}
            itsMe={this.props.currentUserName === user.name}></User>
        ))}
      </ListGroup>
    )
  }
}
