import { reset } from 'redux-form';
import { EVENT_WINDOW_SHOW, EVENT_WINDOW_HIDE } from '../constants/actions.js';

export function eventWindowShow(data) {
  return {type: EVENT_WINDOW_SHOW, data};
}

export function eventWindowHide() {
  return dispatch => {
    dispatch(reset('event'));
    dispatch({type: EVENT_WINDOW_HIDE});
  }
}