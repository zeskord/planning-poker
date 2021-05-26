import io from 'socket.io-client'



const socket = io({
    query: {
        name: localStorage.getItem("name"),
        isSpectator: localStorage.getItem("isSpectator")
    }
})

export default socket