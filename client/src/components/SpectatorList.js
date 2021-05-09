// Представляет список активных пользователей.
import React from "react";
import { Spectator } from "./Spectator";

export const SpectatorList = (props) => {
  return (
    <ul class="list-group" style={{fontSize: '.8rem'}}>
      {props.spectators.map((user) => (
        <Spectator
          key={user.id}
          id={user.id}
          userName={user.name}
        //   itsMe={props.currentUserName === user.name}
        ></Spectator>
      ))}
    </ul>
  );
};
