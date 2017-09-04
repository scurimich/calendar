import { CHANGE_VIEW, CHANGE_VIEWINFO } from '../constants/actions.js';

export function setView(view) {
	return { type: CHANGE_VIEW, view };
}

export function changeViewInfo(data) {
  return { type: CHANGE_VIEWINFO, data };
}