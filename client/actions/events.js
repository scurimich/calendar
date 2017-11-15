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
import { serverRequest } from '../utils/server.js';


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
        makeMomentDates(event);
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
  const dateBegin = moment(data.dateBegin);
  const dateEnd = moment(data.dateEnd);

  data.duration = (dateEnd - dateBegin) / DAY;
  if (data.week && data.week.length !== DAYS_IN_WEEK)
    data.week = data.week.concat(new Array(DAYS_IN_WEEK - data.week.length).fill(null));
  if (data.group) data.group = data.group._id;

  if (event.timeBegin && typeof event.timeBegin === 'object')
    event.timeBegin = event.timeBegin.format('HH:mm')
  if (event.timeEnd && typeof event.timeEnd === 'object')
    event.timeEnd = event.timeEnd.format('HH:mm')

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
      makeMomentDates(json);
      dispatch({ type: EVENT_ADD, event: json });
      resolve();
    });
}

export function removeEvent(id) {
  return dispatch => {
    return  fetch(`/event/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(json => {
      dispatch({ type: EVENT_WINDOW_HIDE });
      dispatch(reset('event'));
      dispatch({ type: EVENT_REMOVE, id });
    })
  };
}

export function updateEvent(event, dispatch) {
  const dateBegin = moment(event.dateBegin, 'YYYY-MM-DD');
  const dateEnd = moment(event.dateEnd, 'YYYY-MM-DD');

  event.duration = (dateEnd - dateBegin) / DAY;
  if (event.week && event.week.length !== DAYS_IN_WEEK)
    event.week = event.week.concat(new Array(DAYS_IN_WEEK - event.week.length).fill(null));
  if (event.group && typeof event.group === 'object') event.group = event.group._id;

  if (event.timeBegin && typeof event.timeBegin === 'object')
    event.timeBegin = event.timeBegin.format('HH:mm')
  if (event.timeEnd && typeof event.timeEnd === 'object')
    event.timeEnd = event.timeEnd.format('HH:mm')

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
      dispatch(reset('event'));
      makeMomentDates(json);
      dispatch({ type: EVENT_CHANGE, event: json });
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
    .then((json) => {
      makeMomentDates(json);
      dispatch({ type: EVENT_CHANGE, event: json });
    });
  };
}

function makeMomentDates(event) {
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
}