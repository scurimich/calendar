import { CHANGE_VIEWINFO } from '../constants/actions.js';

const initialInfo = {
  cellSize: 0,
  lineSize: 21
};

export default function viewInfo(state = initialInfo, action) {
  switch (action.type) {
    case CHANGE_VIEWINFO:
      return { ...state, ...action.data };
    default:
      return state;
  }
}