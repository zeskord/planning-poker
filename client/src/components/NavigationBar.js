import React, { Component } from 'react';
import { Navbar, Nav, Collapse } from 'bootstrap-4-react';

export default class NavigatonBar extends Component {
  constructor(props) {
    super(props)

  }
  
  render() {
    return (
      <Navbar expand="lg" light bg="light">
        <Navbar.Brand href="#">
          {this.props.userName}
        </Navbar.Brand>
        <Navbar.Toggler target="#navbarSupportedContent" />
        <Collapse navbar id="navbarSupportedContent">
          <Navbar.Nav mr="auto">
            <Nav.Item>
              <Nav.Link href="#">Разлогиниться</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#">Полный сброс</Nav.Link>
            </Nav.Item>
          </Navbar.Nav>
        </Collapse>
      </Navbar>
    )
  }
}