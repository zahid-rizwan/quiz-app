import { createSlice } from "@reduxjs/toolkit"

const initialValue={
    user: null,
    login: null ,
    logout: null,
    isAuthenticated: null,
}

const authSlice = createSlice(
    {
        name:"auth",
        initialState:initialValue,
        reducers:{
            login:(state,action)=>{
                state.user = action.payload
                state.login=action.payload
                state.isAuthenticated=true
            },
            logout:(state,action)=>{
                state.user = null,
                state.isAuthenticated = false
                state.login = null
            }
        }
    }
)

export default authSlice.reducer
export const {login,logout} = authSlice.actions
