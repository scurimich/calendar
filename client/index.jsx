import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { Route, Redirect } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

import thunk from 'redux-thunk';
import reducer from './reducers/index';
import Auth from './components/auth/auth';
import App from './components/app';
import { auth } from './actions/auth';

const history = createHistory();

const middleware = routerMiddleware(history);

const store = createStore(reducer,
//   // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk, middleware));

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className='app'>
        <Route exact path='/' component={App} />
        <Route exact path='/login' component={Auth} />
      </div>
    </ConnectedRouter>
	</Provider>,
  document.getElementById('view')
);


