import { GROUP_WINDOW_SHOW, GROUP_WINDOW_HIDE } from '../constants/actions.js';

export function groupWindowShow(data) {
  return {type: GROUP_WINDOW_SHOW, data};
}

export function groupWindowHide() {
  return {type: GROUP_WINDOW_HIDE};
}