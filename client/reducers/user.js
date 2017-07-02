import {
  LOGIN,
  LOGIN_ERROR,
  LOGOUT,
  REGISTER_ERROR
} from '../constants/actions.js';

const initialState = {
  authenticated: false,
  status: '',
  loginError: null,
  registerError: null
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ERROR:
      return { ...state, loginError: action.error, authenticated: false };
    case REGISTER_ERROR:
      return {...state, registerError: action.error, authenticated: false};
    case LOGIN:
      return { ...state, authenticated: true, loginError: null, registerError: null };
    case LOGOUT:
      return { ...state, authenticated: false, loginError: null, registerError: null };
    default:
      return state;
  }
}