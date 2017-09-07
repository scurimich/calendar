import { EVENT_WINDOW_SHOW, EVENT_WINDOW_HIDE } from '../constants/actions.js';
import { addNull } from '../utils.js';

export function eventWindowShow(data) {
  return {type: EVENT_WINDOW_SHOW, data};
}

export function eventWindowHide() {
  return {type: EVENT_WINDOW_HIDE};
}