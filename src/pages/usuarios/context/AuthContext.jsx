import { createContext } from "react"

export const AuthContext = createContext({  user: null,
    loading: true,
    login: () => {},
    logout: () => {},
    isAuthenticated: () => false})


export default AuthContext