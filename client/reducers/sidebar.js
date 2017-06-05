import { ACTIVE_SIDEBAR_INFO } from '../constants/actions.js';

export default function sidebar(state = 'events', action) {
	switch (action.type) {
		case 'ACTIVE_SIDEBAR_INFO':
			return action.content;
		default:
			return state;
	}
}