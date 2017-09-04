import { SELECT_EVENT } from '../constants/actions.js';

export function selectEvent(event) {
  return {type: SELECT_EVENT, event: event};
}