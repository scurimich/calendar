import { CHANGE_SEARCH_STR } from '../constants/actions.js';

export default function search(state = '', action) {
  switch (action.type) {
    case CHANGE_SEARCH_STR:
      return action.text;
    default:
      return state;
  }
}