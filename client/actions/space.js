import {
  CHANGE_DATE,
  CHANGE_SPACE,
  CHANGE_MINI_SPACE,
  INCR_MINI_SPACE,
  DECR_MINI_SPACE
} from '../constants/actions.js';

export function setDate(date) {
  return { type: CHANGE_DATE, date}
}

export function setSpace(date) {
  return { type: CHANGE_SPACE, date };
}

export function setMiniSpace(date) {
  return { type: CHANGE_MINI_SPACE, date };
}

export function incrMiniSpace() {
  return { type: INCR_MINI_SPACE };
}

export function decrMiniSpace() {
  return { type: DECR_MINI_SPACE };
}