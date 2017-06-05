import { CHANGE_CURRENT_SPACE } from '../constants/actions.js';
import { TODAY } from '../constants/calendar.js';

// const initialState = new Date(TODAY.getFullYear(), TODAY.getMonth());
const initialState = new Date('2017', '3');

export default function calendarSpace(state = initialState, action) {
  switch (action.type) {
    // case CHANGE_CURRENT_SPACE:
    //   return action.space;
    default:
      return state;
  }
}