import React from 'react';
import { ListGroup, Badge } from 'bootstrap-4-react';

export const User = (props) => {

  var badge = undefined
  if (!props.markVisible & props.itsMe & props.mark !== undefined) {
    badge = <Badge secondary pill>{props.mark}</Badge>
  } else if (props.markVisible) {
    badge = <Badge primary pill>{props.mark}</Badge>
  }

  return (
    <ListGroup.Item key={props.id} display="flex" justifyContent="between" align="items-center"
      success={props.mark !== undefined}>
      {props.userName}
      {badge !== undefined && badge}
    </ListGroup.Item>
  )
}