import React from "react";

export const PokerCardSpecial = (props) => {
  async function onClick() {
    await props.modalOnSelect(props.title);
  }

  return (
    <div
      className="card my-2 text-center"
      style={{ width: "18rem", height: "100%" }}
      onClick={onClick}
    >
      <img
        src={props.img}
        className="card-img my-2"
        style={{ width: "18rem", height: "4rem" }}
        alt="..."
        data-bs-toggle="modal"
        data-bs-target="#myModal"
      />
    </div>
  );
};
