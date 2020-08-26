// Представляет список активных пользователей.
import React from 'react';
import { ListGroup } from 'bootstrap-4-react';
import { User } from './User'

export const UserList = (props) => {

  return (
    <ListGroup my="2">
      {props.users.map(user => (
        <User key={user.id} id={user.id} userName={user.name} mark={user.mark} markVisible={props.marksVisible}
          itsMe={props.currentUserName === user.name}></User>
      ))}
    </ListGroup>
  )
}

// export default class UserList extends Component {

//   constructor(props) {
//     super(props)

//   }

//   render() {
//     var props = this.props
//     return (
//       <ListGroup my="2">
//         {props.users.map(user => (
//           <User key={user.id} id={user.id} userName={user.name} mark={user.mark} markVisible={props.marksVisible}
//             itsMe={props.currentUserName === user.name}></User>
//         ))}
//       </ListGroup>
//     )
//   }
// }
