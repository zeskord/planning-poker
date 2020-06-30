import React, { Component } from 'react';
import { ListGroup, Badge } from 'bootstrap-4-react';

export default class User extends Component {
  
  
  render() {
    return (
      <ListGroup.Item display="flex" justifyContent="between" align="items-center">
        {this.props.value}
        <Badge primary pill>14</Badge>
      </ListGroup.Item>
    )
  }
}