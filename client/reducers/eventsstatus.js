import {
  EVENTS_FETCHING,
  EVENTS_FETCH_ERROR,
  EVENTS_FETCH_OK
} from '../constants/actions.js';

const initialState = {
  status: '',
  error: ''
}

export default function eventsStatus(state = initialState, action) {
  switch (action.type) {
    case EVENTS_FETCHING:
      return {status: 'fetching', error: ''};
    case EVENTS_FETCH_OK:
      return {status: 'ok', error: ''};
    case EVENTS_FETCH_ERROR:
      return {status: 'error', error: action.error};
    default:
      return state;
  }
}