import {
  GROUPS_ADD,
  GROUP_ADD,
  GROUP_REMOVE,
  GROUP_CHANGE,
  GROUPS_FETCHING,
  GROUPS_FETCH_ERROR,
  GROUPS_FETCH_OK
} from '../constants/actions.js';

export function fetchGroups() {
  const token = localStorage.getItem('token');
  return dispatch => {
    dispatch({ type: GROUPS_FETCHING });
    return fetch('/group', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': token
      }
    })
    .then(res => {
      return res.json();
    })
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

export function addGroup(group) {
  const token = localStorage.getItem('token');
  return dispatch => {
    return fetch('/group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(group)
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    })
  };
}