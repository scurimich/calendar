import {
  GROUPS_ADD,
  GROUP_ADD,
  GROUP_REMOVE,
  GROUP_CHANGE
} from '../constants/actions.js';

export default function group(state = [], action) {
  switch (action.type) {
    case GROUPS_ADD:
      return action.groups;
    case GROUP_ADD:
      return [...state, action.group];
    case GROUP_REMOVE:
      state.splice(state.findIndex(val => val._id === action._id), 1);
      return [...state];
    case GROUP_CHANGE:
      state.splice(state.findIndex(val => val._id === action.group._id), 1, action.group);
      return [...state];
    default:
      return state;
  }
}