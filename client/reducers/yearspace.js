import { CHANGE_YEAR_VIEW_SPACE } from '../constants/actions';
import { TODAY } from '../constants/calendar';

const initialState = TODAY.getFullYear();

export default function yearSpace(state = initialState, action) {
  switch (action.type) {
    // case CHANGE_YEAR_VIEW_SPACE:
    //   return action.space;
    default:
      return state;
  }
}