import React from "react";
import { PokerCard } from "./PokerCard";

export const PokerCards = (props) => {
  var marks = ["0", "0.5", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"];

  return (
    <div>
      {marks.map((mark) => (
        <PokerCard
          variant="primary"
          key = {mark}
          title={mark}
          modalOnSelect={props.modalOnSelect}
        />
      ))}
    </div>
  );
};
