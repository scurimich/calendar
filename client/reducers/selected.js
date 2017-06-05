import { SELECT_EVENT } from '../constants/actions';

export default function selected(state = null, action) {
  switch (action.type) {
    case SELECT_EVENT:
      return action.event;
    default: 
      return state;
  }
}
