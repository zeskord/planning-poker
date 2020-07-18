import React, { Component, Fragment } from 'react';
import { ListGroup, Badge } from 'bootstrap-4-react';

export default class User extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <ListGroup.Item display="flex" justifyContent="between" align="items-center" success={this.props.mark !== undefined}>
        {this.props.userName}
        {this.props.markVisible ?
          (<Badge primary pill>{this.props.mark}</Badge>) :
          (<Fragment></Fragment>)
        }
      </ListGroup.Item>
    )
  }
}