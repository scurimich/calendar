import {
  LOGIN,
  AUTH_ERROR,
  LOGOUT
} from '../constants/actions.js';

const initialState = {
  authenticated: false,
  status: '',
  error: ''
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case AUTH_ERROR:
      return { ...state, error: action.error, authenticated: false };
    case LOGIN:
      return { ...state, authenticated: true, error: '' };
    case LOGOUT:
      return { ...state, authenticated: false, error: '' };
    default:
      return state;
  }
}