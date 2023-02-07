import { combineReducers } from "redux";
import posts from './postsReducers';
import authReducer from "./authReducers";

const rootReducer = combineReducers({ posts, authReducer })

export default rootReducer;