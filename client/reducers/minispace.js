import { CHANGE_MINI_SPACE, INCR_MINI_SPACE, DECR_MINI_SPACE } from '../constants/actions.js';
import { TODAY } from '../constants/calendar.js';

const initialState = new Date('2017', '3');
// const initialState = new Date(TODAY.getFullYear(), TODAY.getMonth());

export default function miniSpace(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}