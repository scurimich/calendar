import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';

import Sidebar from './sidebar/sidebar';
import Controls from './controls/controls';
import Body from './body/body';

import { login, register, auth } from '../actions/auth';
import { fetchEvents } from '../actions/events';
import './app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { auth, user, events, eventsStatus, fetchEvents } = this.props;
    const { authenticated } = user;
    const token = localStorage.getItem('token');
    if (!token) return <Redirect to='/login' />;
    if (token && !authenticated) auth(token);
    if (!events.length && !eventsStatus) fetchEvents();
    return (
      <div className="container">
        <Sidebar />
        <div className="content">
          <Controls />
          <Body />
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  user: state.user,
  events: state.events,
  eventsStatus: state.eventsStatus.status
});

const mapDispatchToProps = dispatch => bindActionCreators({
  auth,
  fetchEvents
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
