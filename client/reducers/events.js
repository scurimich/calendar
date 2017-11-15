import {
	EVENTS_ADD,
	EVENT_ADD,
	EVENT_REMOVE,
	EVENT_CHANGE
} from '../constants/actions.js';

export default function events(state = [], action) {
	switch (action.type) {
		case EVENTS_ADD:
			return action.events;
		case EVENT_ADD:
			return [...state, action.event];
		case EVENT_REMOVE:
			state.splice(state.findIndex(val => val._id === action.id), 1);
			return [...state];
		case EVENT_CHANGE:
			state.splice(state.findIndex(val => val._id === action.event._id), 1, action.event);
			return [...state];
		default:
			return state;
	}
}