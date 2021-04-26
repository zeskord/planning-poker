import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";

export const User = (props) => {

  var badge = undefined
  if (!props.markVisible & props.itsMe & props.mark !== undefined) {
    badge = <Badge variant="secondary" pill className="my-1">{props.mark}</Badge>
  } else if (props.markVisible) {
    badge = <Badge variant="primary" pill className="my-1">{props.mark}</Badge>
  }

  return (
    <ListGroup.Item key={props.id} display="flex" align="items-center" className="justify-content-between"
      variant={(  props.mark !== undefined ? "success" : "")}>
        <div className="d-flex justify-content-between">
          {props.userName}
          {badge !== undefined && badge}
        </div>
    </ListGroup.Item>
  )
}