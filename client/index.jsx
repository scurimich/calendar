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

const def = () => {
  const authenticated = store.getState().user.authenticated;
  // return authenticated ? <App /> : <Redirect to='/login' />;
  return <App />;
};

const login = () => {
  const authenticated = store.getState().user.authenticated;
  // return authenticated ? <Redirect to='/' /> : <Auth />;
  return <Auth />;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className='app'>
        <Route exact path='/' render={def} />
        <Route exact path='/login' render={login} />
      </div>
    </ConnectedRouter>
	</Provider>,
  document.getElementById('view')
);


