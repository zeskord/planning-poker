import React from 'react';

export const Spectator = (props) => {

  return (
    <li className="list-group-item justify-content-between align-items-center py-1" key={props.id}>
        <div className="d-flex justify-content-between">
          {props.userName}
        </div>
    </li>
  )
}