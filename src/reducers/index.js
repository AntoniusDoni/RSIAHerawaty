import { combineReducers } from "redux";
import auth from "./auth";
import setting from "./setting";
import message from "./message";

export default combineReducers({
  auth, setting,
  message,
});