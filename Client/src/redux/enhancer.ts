// import { routerMiddleware } from "connected-react-router";
import { applyMiddleware, compose } from "redux";
import thunk, { ThunkDispatch } from 'redux-thunk'
// import { history } from "./reducer"



declare global {
    /* tslint:disable:interface-name */
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    }
  }
  
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  
  export let rootEnhancer = composeEnhancer(
    // applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk),
 )