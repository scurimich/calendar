import { SELECT_EVENT, CHANGE_SELECTED_EVENT, REMOVE_EVENT_SELECTION } from '../constants/actions.js';

export function selectEvent(event) {
  return {type: SELECT_EVENT, event};
}

export function changeSelectedEvent(event) {
  return {type: CHANGE_SELECTED_EVENT, event};
}

export function removeEventSelection() {
  return {type: REMOVE_EVENT_SELECTION};
}