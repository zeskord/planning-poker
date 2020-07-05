import {createContext} from 'react'

function noop() {}

export const GlobalContext = createContext({
  name: null,
  isAuthenticated: false
})