import { SELECT_EVENT, CHANGE_SELECTED_EVENT, REMOVE_EVENT_SELECTION } from '../constants/actions.js';

export default function selected(state = null, action) {
  switch (action.type) {
    case SELECT_EVENT:
      return action.event;
    case CHANGE_SELECTED_EVENT:
      return {...state, ...action.event};
    case REMOVE_EVENT_SELECTION:
      return null;
    default: 
      return state;
  }
}
