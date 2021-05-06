// Представляет список активных пользователей.
import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Spectator } from "./Spectator";

export const SpectatorList = (props) => {
  return (
    <ListGroup style={{fontSize: '.8rem'}}>
      {props.spectators.map((user) => (
        <Spectator
          key={user.id}
          id={user.id}
          userName={user.name}
        //   itsMe={props.currentUserName === user.name}
        ></Spectator>
      ))}
    </ListGroup>
  );
};
