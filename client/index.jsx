import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers/index';
import App from './components/app';
import { auth } from './actions/auth';

const store = createStore(reducer,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk));
const token = localStorage.getItem('token');

if (token) store.dispatch(auth(token));


ReactDOM.render(
  <Provider store={store}>
		<App />
	</Provider>,
  document.getElementById('app')
);
