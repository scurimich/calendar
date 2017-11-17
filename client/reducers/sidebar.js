import { SWITCH_SIDEBAR } from '../constants/actions.js';

export default function sidebar(state = false, action) {
	switch (action.type) {
		case SWITCH_SIDEBAR:
			return !state;
		default:
			return state;
	}
}