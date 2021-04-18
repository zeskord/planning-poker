import React from 'react'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export const NavigationBar = (props) => {

  async function logoutClick(event) {
    const url = '/logOut'
    await fetch(url, { method: 'POST' })
    // Процедура, переданная из самого корня.
    const userData = {
      userName: undefined,
      isAuthenticated: false
    }
    props.setAuthState(userData)
  }

  async function fullReset(event) {
    const url = '/fullReset'
    await fetch(url, { method: 'POST' })
  }
  
  return (
    <Navbar expand="lg" bg="light">
      <Navbar.Brand href="#">
        {props.userName}
      </Navbar.Brand>
      <Navbar.Toggle target="#navbarSupportedContent" />
      <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="mr-auto">
          <Nav.Link href="#" onClick={logoutClick}>Разлогиниться</Nav.Link>
          <Nav.Link href="#" onClick={fullReset}>Полный сброс</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )

}
