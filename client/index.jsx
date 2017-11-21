import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import reducer from './reducers/index.js';
import Auth from './components/auth/auth.jsx';
import App from './components/app.jsx';
import { auth } from './actions/auth.js';

const history = createHistory();

const middleware = routerMiddleware(history);

const store = createStore(reducer,
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


