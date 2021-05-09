import React from "react";

export const PokerCard = (props) => {
  async function onClick() {
    await props.modalOnSelect(props.title);
  }

  return (
    <div
      className="card my-2 text-center"
      style={{ width: "18rem" }}
      onClick={onClick}
    >
      <div className="card-body">
        <h5
          className="card-title align-middle"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
          style={{ fontSize: "2rem" }}
        >
          {props.title}
        </h5>
      </div>
    </div>
  );
};
