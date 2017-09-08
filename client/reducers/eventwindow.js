import { EVENT_WINDOW_SHOW, EVENT_WINDOW_HIDE } from '../constants/actions.js';
import { TODAY } from '../constants/calendar.js';

const windowState = {
  showed: false,
  data: {
    title: '',
    description: '',
    dateBegin: null,
    dateEnd: null,
    allDay: true,
    timeBegin: null,
    timeEnd: null,
    periodic: false,
    group: null,
    notification: true
  }
};

export default function eventWindow(state = windowState, action) {
  switch (action.type) {
    case EVENT_WINDOW_SHOW:
      return {...state, showed: true, data: {...state.data, ...action.data} };
    case EVENT_WINDOW_HIDE:
      return {...state, showed: false, data: {allDay: true, periodic: false, notification: true}};
    default:
      return state;
  }
}