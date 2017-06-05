import { CHANGE_VIEW } from '../constants/actions';

export function setView(view) {
	return { type: CHANGE_VIEW, view }
}