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
import { reset } from 'redux-form';


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
              // console.log(event[prop], event.title)
            }
            
          }
        }
        return event;
      });
      dispatch({ type: EVENTS_FETCH_OK });
      dispatch({ type: EVENTS_ADD, events});
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: EVENTS_FETCH_ERROR, error: err.message});
    });
  };
}

export function addEvent(data) {
  console.log(data)
  const token = localStorage.getItem('token');
  return dispatch => {
    return fetch('/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (res.status === 403) throw new Error('Please login or register');
      if (res.status === 401) throw new Error('Please login or register');
      return res.json()
    })
    .then(data => {
      if(data.error) throw new Error({message: data.error});
      dispatch({ type: EVENT_WINDOW_HIDE });
      dispatch(reset('event'));
      dispatch({ type: EVENT_ADD, event: data });
    })
    .catch((err) => {
      // console.log(err);
      // console.log(err.message);
    })
  };
}

export function removeEvent(event) {
	return { type: EVENT_REMOVE, event}
}

export function changeEvent(event) {
	return { type: EVENT_CHANGE, event}
}