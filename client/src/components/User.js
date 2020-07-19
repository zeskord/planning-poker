import React, { Component, Fragment } from 'react';
import { ListGroup, Badge } from 'bootstrap-4-react';

export default class User extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    var badge = undefined
    if (!this.props.markVisible & this.props.itsMe & this.props.mark !== undefined) {
      badge = <Badge secondary pill>{this.props.mark}</Badge>
    } else if (this.props.markVisible) {
      badge = <Badge primary pill>{this.props.mark}</Badge>
    }
    return (
      <ListGroup.Item key={this.props.key} display="flex" justifyContent="between" align="items-center" success={this.props.mark !== undefined}>
        {this.props.userName}
        {badge !== undefined && badge}
      </ListGroup.Item>
    )
  }
}
