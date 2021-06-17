import React from "react";
import { PokerCard } from "./PokerCard";
import { PokerCardSpecial } from "./PokerCardSpecial";

export const PokerCards = (props) => {
  var marks = [
    "0",
    "0.5",
    "1",
    "2",
    "3",
    "5",
    "8",
    "13",
    "21",
    "34",
    "55",
    "89",
  ];

  return (
    <div>
      <PokerCardSpecial
        variant="primary"
        key="coffee"
        title="coffee"
        img="coffee-dark.svg"
        modalOnSelect={props.modalOnSelect}
      />
      {marks.map((mark) => (
        <PokerCard
          variant="primary"
          key={mark}
          title={mark}
          modalOnSelect={props.modalOnSelect}
        />
      ))}
      <PokerCardSpecial
        variant="primary"
        key="infinity"
        title="infinity"
        img="infinity-dark.svg"
        modalOnSelect={props.modalOnSelect}
      />
    </div>
  );
};
