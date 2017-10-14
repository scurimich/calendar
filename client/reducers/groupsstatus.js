import {
  GROUPS_FETCHING,
  GROUPS_FETCH_ERROR,
  GROUPS_FETCH_OK
} from '../constants/actions.js';

const initialState = {
  status: '',
  error: ''
}

export default function groupsStatus(state = initialState, action) {
  switch (action.type) {
    case GROUPS_FETCHING:
      return {status: 'fetching', error: ''};
    case GROUPS_FETCH_OK:
      return {status: 'ok', error: ''};
    case GROUPS_FETCH_ERROR:
      return {status: 'error', error: action.error};
    default: 
      return state;
  }
}