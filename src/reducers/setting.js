import {
    SETTING_SUCCESS,
    SETTING_FAIL,
} from "../actions/types";
const setting = JSON.parse(localStorage.getItem("setting"));
const initialState = setting
    ? { isLoggedIn: true, setting }
    : { isLoggedIn: false, setting: null };

export default function settings (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SETTING_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                setting: payload.setting,
            };
        case SETTING_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                setting: null,
            };
        default:
            return state;
    }
}