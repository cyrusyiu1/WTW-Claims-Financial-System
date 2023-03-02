// import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { authReducer } from "./auth/reducer";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export const rootReducer = combineReducers({
  router: connectRouter(history),
  auth: authReducer,
});