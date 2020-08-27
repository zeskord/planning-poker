import React from 'react'
import { Navbar, Nav, Collapse } from 'bootstrap-4-react'

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
    <Navbar expand="lg" light bg="light">
      <Navbar.Brand href="#">
        {props.userName}
      </Navbar.Brand>
      <Navbar.Toggler target="#navbarSupportedContent" />
      <Collapse navbar id="navbarSupportedContent">
        <Navbar.Nav mr="auto">
          <Nav.Item>
            <Nav.Link href="#" onClick={logoutClick}>Разлогиниться</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" onClick={fullReset}>Полный сброс</Nav.Link>
          </Nav.Item>
        </Navbar.Nav>
      </Collapse>
    </Navbar>
  )

}

// export default class NavigatonBar extends Component {
//   constructor(props) {
//     super(props)
//     this.logoutClick = this.logoutClick.bind(this)
//     this.fullReset = this.fullReset.bind(this)
//   }

//   async logoutClick(event) {
//     const url = '/logOut'
//     await fetch(url, { method: 'POST' })
//     // Процедура, переданная из самого корня.
//     this.props.setAuthState({ name: undefined }, false)
//   }

//   async fullReset(event) {
//     const url = '/fullReset'
//     await fetch(url, { method: 'POST' })
//   }

//   render() {
//     return (
//       <Navbar expand="lg" light bg="light">
//         <Navbar.Brand href="#">
//           {this.props.userName}
//         </Navbar.Brand>
//         <Navbar.Toggler target="#navbarSupportedContent" />
//         <Collapse navbar id="navbarSupportedContent">
//           <Navbar.Nav mr="auto">
//             <Nav.Item>
//               <Nav.Link href="#" onClick={this.logoutClick}>Разлогиниться</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link href="#" onClick={this.fullReset}>Полный сброс</Nav.Link>
//             </Nav.Item>
//           </Navbar.Nav>
//         </Collapse>
//       </Navbar>
//     )
//   }
// }