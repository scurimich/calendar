import { CHANGE_DATE } from '../constants/actions';
import { TODAY } from '../constants/calendar';

export default function date(state = new Date('2017 04 17'), action) {
  switch (action.type) {
    case CHANGE_DATE:
      return action.date
    default:
      return state;
  }
}