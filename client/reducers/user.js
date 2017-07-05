import {
  LOGIN,
  LOGOUT
} from '../constants/actions.js';

const initialState = {
  authenticated: false,
  status: ''
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, authenticated: true };
    case LOGOUT:
      return { ...state, authenticated: false };
    default:
      return state;
  }
}