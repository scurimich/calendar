import { GROUP_WINDOW_SHOW, GROUP_WINDOW_HIDE } from '../constants/actions.js';

const windowState = {
  showed: false,
  data: {
    label: '',
    color: '#000000'
  }
};

export default function eventWindow(state = windowState, action) {
  switch (action.type) {
    case GROUP_WINDOW_SHOW:
      return {...state, showed: true, data: {...state.data, ...action.data} };
    case GROUP_WINDOW_HIDE:
      return {...state, showed: false};
    default:
      return state;
  }
}