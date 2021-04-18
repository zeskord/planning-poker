import React from 'react';
import Card from "react-bootstrap/Card";

export const PokerCard = (props) => {


    return (
        <Card 
        className="mb-2 text-center"
        bg={props.variant.toLowerCase()}
        key={props.key}
        // variant="top"
        text={props.variant.toLowerCase() === "light" ? "dark" : "white"}
        style={{ width: "18rem" }}
        >
        {/* <Card.Header>Header</Card.Header> */}
        <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            {/* <Card.Text>
            
            </Card.Text> */}
        </Card.Body>
        </Card>
       )
    }
       
