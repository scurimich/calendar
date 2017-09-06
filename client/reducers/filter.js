import { SELECT_GROUP } from '../constants/actions.js';

export default function currentGroup(state = null, action) {
  switch (action.type) {
    case SELECT_GROUP:
      return action.group;
    default:
      return state;
  }
}