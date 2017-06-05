import { CHANGE_SEARCH_STR } from '../constants/actions.js';

export function changeSearchStr(text) {
  return { type: CHANGE_SEARCH_STR, text: text };
}
