import { CHANGE_VIEW, CHANGE_MONTHVIEW } from '../constants/actions.js';

export function setView(view) {
	return { type: CHANGE_VIEW, view };
}

export function changeMonthView(data) {
  return { type: CHANGE_MONTHVIEW, data };
}