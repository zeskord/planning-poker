import React from 'react';

export const User = (props) => {

  var badge = undefined
  if (!props.markVisible & props.itsMe & props.mark !== undefined) {
    badge = <span className="badge rounded-pill bg-secondary mt-1">{props.mark}</span>
  } else if (props.markVisible) {
    badge = <span className="badge rounded-pill bg-primary mt-1">{props.mark}</span>
  }
  var liClass = "list-group-item justify-content-between align-items-center" + (  props.mark !== undefined ? " list-group-item-success" : "")

  return (
    <li className={liClass} key={props.id}>
        <div className="d-flex justify-content-between my-1">
          {props.userName}
          {badge !== undefined && badge}
        </div>
    </li>
  )
}