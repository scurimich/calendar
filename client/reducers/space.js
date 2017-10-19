import {
  CHANGE_SPACE,
  CHANGE_MINI_SPACE,
  INCR_MINI_SPACE,
  DECR_MINI_SPACE
} from '../constants/actions';
import { TODAY } from '../constants/calendar';

const initialSpace = {
  main: TODAY,
  mini: TODAY
}


export default function space(state = initialSpace, action) {
  switch (action.type) {
    case CHANGE_SPACE:
      return { ...state, main: action.date };
    case CHANGE_MINI_SPACE:
      return { ...state, mini: action.date };
    case INCR_MINI_SPACE:
      const incrDate = state.mini.clone().add(1, 'month');
      return { ...state, mini: incrDate };
    case DECR_MINI_SPACE:
      const decrDate = state.mini.clone().subtract(1, 'month');
      return { ...state, mini: decrDate };
    default: 
      return state;
  }
}