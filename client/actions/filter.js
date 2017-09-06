import { SELECT_GROUP } from '../constants/actions.js';

export function selectGroup(group) {
  return {type: SELECT_GROUP, group: group};
}