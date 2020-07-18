import {createContext} from 'react'

function noop() {}

export const PlanningPageContext = createContext({
  name: null,
  isAuthenticated: false
})