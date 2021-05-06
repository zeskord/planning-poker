import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";

export const Spectator = (props) => {

  return (
    <ListGroup.Item key={props.id} display="flex" align="items-center" className="py-1 justify-content-between" variant="light">
        <div className="d-flex justify-content-between">
          {props.userName}
        </div>
    </ListGroup.Item>
  )
}