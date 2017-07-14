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
import { DAY, DAYS_IN_WEEK } from '../constants/calendar.js';
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

export function addEvent(windowState, data, dispatch) {
  const {allDay, periodic, notification} = windowState;
  data = {...data, allDay, periodic, notification};
  if (data.dateBegin) data.dateBegin = new Date(data.dateBegin);
  if (data.dateEnd) data.dateEnd = new Date(data.dateEnd);
  if (data.timeBegin) data.timeBegin = new Date(1970, 0, 1, data.timeBegin.substr(0, 2), data.timeBegin.substr(3, 2));
  if (data.timeEnd) data.timeEnd = new Date(1970, 0, 1, data.timeEnd.substr(0, 2), data.timeEnd.substr(3, 2));
  data.duration = (data.dateEnd - data.dateBegin) / DAY;
  if (data.week && data.week.length !== DAYS_IN_WEEK) {
    data.week = data.week.concat(new Array(DAYS_IN_WEEK - data.week.length).fill(null));
  }

  const token = localStorage.getItem('token');
  return serverRequest(data, '/event', 'POST', token)
    .then(([response, json]) => {
      if (response.status === 403) throw new SubmissionError({_error: 'Adding failed'});
      if (json.errors) {
        const jsonErr = json.errors;
        const errors = {};
        for (let prop in json.errors) {
          if (jsonErr.hasOwnProperty(prop)) {
            errors[prop] = jsonErr[prop].message;
          }
        }
        throw new SubmissionError(errors);
      }
      console.log(json)
      dispatch({ type: EVENT_WINDOW_HIDE });
      dispatch(reset('event'));
      for (let prop in json) {
        if (json[prop]) {
          if (prop === 'dateBegin' || prop === 'dateEnd') {
            json[prop] = new Date(json[prop]);
            json[prop].setHours(0);
          }
          if (prop === 'timeBegin' || prop === 'timeEnd') {
            json[prop] = new Date(json[prop]);
          }
        }
      }
      dispatch({ type: EVENT_ADD, event: json });
      resolve();
    });
}

export function removeEvent(event) {
	return { type: EVENT_REMOVE, event}
}

export function changeEvent(event) {
	return { type: EVENT_CHANGE, event}
}