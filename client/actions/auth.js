import { LOGIN, LOGIN_ERROR, LOGOUT, REGISTER } from '../constants/actions.js';

export function login(user) {
  return dispatch => {
    return fetch('/login', {
      headers: {  
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'POST',
      body: JSON.stringify(user)
    })
      .then(res => {
        if (res.status !== 200) throw new Error(); 
        return res.json();
      })
      .then(data => {
        if(data.errors) throw data.errors;
        localStorageSave(data);
        dispatch({type: LOGIN, email: data.user});
      })
      .catch((err) => {
        console.log(err);
        dispatch({type: LOGIN_ERROR, error: 'Incorrect data'});
      });
  };
}

export function register(user) {
  return dispatch => {
    return fetch('/register', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'POST',
      body: JSON.stringify(user)
    })
      .then(res => {
        if (res.status !== 200) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        if(data.errors) throw data.errors;
        localStorageSave(data);
        dispatch({type: LOGIN, email: data.user});
      })
      .catch(err => {
        console.log(err);
        dispatch({type: LOGIN_ERROR, error: 'Incorrect data'});
      })
  };
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
      // console.log(data)
      if(data.message || data.errors) throw new Error(data.message);
      const user = localStorage.getItem('user');
      dispatch({type: LOGIN, email: user});
    })
    .catch((err) => {
      console.log(err);
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