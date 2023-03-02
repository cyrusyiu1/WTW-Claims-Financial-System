import { IAuthAction } from "./action";
import { IAuthState, JWTPayload } from "./state";
import jwt from "jwt-decode"

const initialState:IAuthState = {
    user : {id:loadTokenId() as number,username:loadTokenUser()},
    userPassword: {},
    registerResult: { type: 'idle' },
    loginResult:{type: 'idle' },
    isAuthenticated: (localStorage.getItem('token') !=null),
    msg: ""
}

function loadTokenUser() {
    const token = localStorage.getItem('token')
    if (token) {
        const payload: JWTPayload = jwt(token)
        return payload.username
    }
    return ""
}

function loadTokenId() {
    const token = localStorage.getItem('token')
    if (token) {
        const payload: JWTPayload = jwt(token)
        return payload.id
    }
    return ""
}

export const authReducer = (state: IAuthState= initialState, action:IAuthAction) =>{
    switch(action.type){
        case "@@Auth/LOGIN":
            return {
                ...state,
                isAuthenticated: true
            } 
        default:{return state}

        case "@@Auth/LOGOUT":
            return {
                ...state,
                isAuthenticated: false,

            } 
    }
}