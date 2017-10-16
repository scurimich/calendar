import { reset, SubmissionError } from 'redux-form';
import moment from 'moment';

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
import { serverRequest } from '../utils.js';


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
              event[prop] = moment(event[prop], 'YYYY-MM-DD');
            }
            if (prop === 'timeBegin' || prop === 'timeEnd') {
              event[prop] = moment(event[prop], 'HH:mm');
            }
          }
        }
        return event;
      });
      dispatch({ type: EVENTS_ADD, events});
      dispatch({ type: EVENTS_FETCH_OK });
    })
    .catch((err) => {
      dispatch({ type: EVENTS_FETCH_ERROR, error: err.message});
    });
  };
}

export function addEvent(data, dispatch) {
  const dateBegin = moment(data.dateBegin, 'YYYY-MM-DD');
  const dateEnd = moment(data.dateEnd, 'YYYY-MM-DD');

  data.duration = (dateEnd - dateBegin) / DAY;
  if (data.week && data.week.length !== DAYS_IN_WEEK)
    data.week = data.week.concat(new Array(DAYS_IN_WEEK - data.week.length).fill(null));
  if (data.group) data.group = data.group._id;

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
      dispatch({ type: EVENT_WINDOW_HIDE });
      dispatch(reset('event'));
      for (let prop in json) {
        if (json[prop]) {
          if (prop === 'dateBegin' || prop === 'dateEnd') {
            json[prop] = moment(json[prop], 'YYYY-MM-DD');
          }
          if (prop === 'timeBegin' || prop === 'timeEnd') {
            json[prop] = moment(json[prop], 'HH:mm');
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

export function updateEvent(event, dispatch) {
  if (event.dateBegin)
    event.dateBegin = new Date(new Date(event.dateBegin).setHours(0));
  if (event.dateEnd)
    event.dateEnd = new Date(new Date(event.dateEnd).setHours(0));

  if (event.timeBegin && typeof event.timeBegin === 'string')
    event.timeBegin = new Date(1970, 0, 1, event.timeBegin.substr(0, 2), event.timeBegin.substr(3, 2));
  if (event.timeEnd && typeof event.timeBegin === 'string')
    event.timeEnd = new Date(1970, 0, 1, event.timeEnd.substr(0, 2), event.timeEnd.substr(3, 2));

  event.duration = (event.dateEnd - event.dateBegin) / DAY;
  if (event.week && event.week.length !== DAYS_IN_WEEK) 
    event.week = event.week.concat(new Array(DAYS_IN_WEEK - event.week.length).fill(null));
  if (event.group) event.group = event.group._id;

  if (dispatch) {
  const token = localStorage.getItem('token');
  return serverRequest(event, `/event/${event._id}`, 'PUT', token)
    .then(([response, json]) => {
      if (response.status === 403) throw new SubmissionError({_error: 'Updating failed'});
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
      dispatch({ type: EVENT_WINDOW_HIDE });
      dispatch({ type: EVENT_CHANGE, event });
      dispatch(reset('event'));
      resolve();
    });
  }

  return dispatch => {
    return fetch(`/event/${event._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(event)
    })
    .then(res => res.json())
    .then(() => {
      dispatch({ type: EVENT_CHANGE, event });
    });
  };
}