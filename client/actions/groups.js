import { reset, SubmissionError } from 'redux-form';
import {
  GROUPS_ADD,
  GROUP_ADD,
  GROUP_REMOVE,
  GROUP_CHANGE,
  GROUPS_FETCHING,
  GROUPS_FETCH_ERROR,
  GROUPS_FETCH_OK,
  GROUP_WINDOW_HIDE
} from '../constants/actions.js';
import { serverRequest } from '../utils.js';

export function fetchGroups() {
  return dispatch => {
    dispatch({ type: GROUPS_FETCHING });
    return fetch('/group', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(groups => {
      dispatch({ type: GROUPS_FETCH_OK });
      dispatch({ type: GROUPS_ADD, groups });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: GROUPS_FETCH_ERROR });
    })
  };
}

export function addGroup(group, dispatch) {
  const token = localStorage.getItem('token');
  return serverRequest(group, '/group', 'POST', token)
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
      dispatch({ type: GROUP_WINDOW_HIDE });
      dispatch({ type: GROUP_ADD, group });
      dispatch(reset('group'));
      resolve();
    });
}

export function removeGroup(group) {
  console.log(group);
  return dispatch => {
    return fetch(`/group/${group._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
  }
}

export function changeGroup(data) {
  const token = localStorage.getItem('token');
  return dispatch => {
    return  fetch(`/group/${data._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(data.group)
    })
    .then(res => {
      return res.json();
    })
    .then(group => {
      dispatch({ type: EVENT_CHANGE, group});
    })
    .catch((err) => {
      console.log(err);
    });
  };
}