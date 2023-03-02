import { rootEnhancer } from "./enhancer";
import { rootReducer } from "./reducer";
import { createStore } from 'redux';

const store = createStore(rootReducer, rootEnhancer);


export default store;