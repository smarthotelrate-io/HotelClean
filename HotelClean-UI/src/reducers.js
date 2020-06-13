import { combineReducers } from 'redux';
import hotel from "./modules/hotel";
import { connectRouter } from "connected-react-router";



export default (history) => combineReducers({
    router: connectRouter(history),
    root: (state, action) =>  hotel(state, action),
})

