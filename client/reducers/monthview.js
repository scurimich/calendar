import { CHANGE_MONTHVIEW } from '../constants/actions.js';

const initialInfo = {
  cellSize: 0,
  lineSize: 0,
  allEvents: null
};

export default function monthView(state = initialInfo, action) {
  switch (action.type) {
    case CHANGE_MONTHVIEW:
      return { ...state, ...action.data };
    default:
      return state;
  }
}