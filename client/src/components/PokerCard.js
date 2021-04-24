import React from 'react';
import Card from "react-bootstrap/Card";

export const PokerCard = (props) => {

    async function onClick() {
        await props.onClick(props.title)
      }

    return (
        <Card 
        className="my-2 text-center"
        bg={props.variant.toLowerCase()}
        key={props.key}
        // variant="top"
        text={props.variant.toLowerCase() === "light" ? "dark" : "white"}
        style={{ width: "18rem" }}
        onClick={onClick}
        >
        {/* <Card.Header>Header</Card.Header> */}
        <Card.Body>
            <Card.Title className="align-middle"
            style={{ fontSize: '2rem' }}>{props.title}</Card.Title>
            {/* <Card.Text>
                {props.as}
            </Card.Text> */}
        </Card.Body>
        </Card>
       )
    }
       
