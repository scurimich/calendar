import { reset, SubmissionError } from 'redux-form';
import {
  EVENTS_FETCHING,
  EVENTS_FETCH_ERROR,
  EVENTS_FETCH_OK,
  EVENTS_ADD,
  EVENT_ADD,
  EVENT_REMOVE,
  EVENT_CHANGE,
  EVENT_WINDOW_HIDE
} from '../constants/actions.js';
import { serverRequest } from '../utils';


export function fetchEvents() {
  return dispatch => {
    dispatch({ type: EVENTS_FETCHING });
    return  fetch('/event', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': localStorage.getItem('token')
      }
    })
    .then(res => {
      return res.json();
    })
    .then(events => {
      events = events.map(event => {
        for (let prop in event) {
          if (event[prop]) {
            if (prop === 'dateBegin' || prop === 'dateEnd') {
              event[prop] = new Date(event[prop]);
              event[prop].setHours(0);
            }
            if (prop === 'timeBegin' || prop === 'timeEnd') {
              event[prop] = new Date(event[prop]);
            }
            
          }
        }
        return event;
      });
      dispatch({ type: EVENTS_ADD, events});
      dispatch({ type: EVENTS_FETCH_OK });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: EVENTS_FETCH_ERROR, error: err.message});
    });
  };
}

export function addEvent(data) {
  const token = localStorage.getItem('token');
  return serverRequest(data, '/event', 'POST', token)
    .then(([responce, json]) => {
      if (responce.status !== 200) throw new SubmissionError({_error: 'Adding failed'});
      if(json.error) throw new SubmissionError({_error: json.error});
      dispatch({ type: EVENT_WINDOW_HIDE });
      dispatch(reset('event'));
      dispatch({ type: EVENT_ADD, json });
      resolve();
    });
}

export function removeEvent(event) {
	return { type: EVENT_REMOVE, event}
}

export function changeEvent(event) {
	return { type: EVENT_CHANGE, event}
}