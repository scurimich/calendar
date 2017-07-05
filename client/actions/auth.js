import { SubmissionError } from 'redux-form';
import { LOGIN, LOGIN_ERROR, LOGOUT, REGISTER, REGISTER_ERROR } from '../constants/actions';
import { serverRequest } from '../utils';

export function login(user, dispatch) {
  return serverRequest(user, '/login', 'POST')
    .then(([responce, json]) => {
      if (responce.status !== 200) throw new SubmissionError({_error: 'Login Failed'}); 
      if (json.errors) throw new SubmissionError(json.errors);
      else {
        localStorageSave(json);
        dispatch({type: LOGIN, email: json.user});
        window.location.href='/';
        resolve();
      }
    });
}

export function register(user, dispatch) {
  return serverRequest(user, '/register', 'POST')
    .then(([responce, json]) => {
      if (responce.status !== 200) throw new SubmissionError({_error: 'Login Failed'});
      if (json.errors) {
        const errors = {};
          for (let prop in json.errors) {
            if (err.hasOwnProperty(prop) ) {
              errors[prop] = err[prop] instanceof Object ?
                errors[prop] = err[prop].message :
                errors[prop] = err[prop];
            }
          }
        throw new SubmissionError(errors);
      }
      else {
        localStorageSave(json);
        dispatch({type: LOGIN, email: json.user});
        window.location.href='/';
        resolve();
      }
    })
}

export function logout() {
  return dispatch => {
    dispatch({type: LOGOUT});
    localStorageClear();
  }
};

export function auth(token) {
  return dispatch => {
    return fetch('/auth', {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    })
    .then(res => {
      if (res.status !== 200) throw new Error();
      return res.json()
    })
    .then(data => {
      if (data.errors) throw new Error();
      const user = localStorage.getItem('user');
      dispatch({type: LOGIN, email: user});
    })
    .catch((err) => {
      dispatch({type: LOGOUT});
      localStorageClear();
    });
  }
};


function localStorageSave(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', data.user);
}

function localStorageClear() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}