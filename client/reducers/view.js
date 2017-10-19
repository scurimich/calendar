import { CHANGE_VIEW } from '../constants/actions.js';

export default function view(state = 'Year', action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return state = action.view;
    default:
      return state;
  }
}