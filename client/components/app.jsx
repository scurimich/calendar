import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';

import Sidebar from './sidebar/sidebar';
import Controls from './controls/controls';
import Body from './body/body';
import NotificationContainer from './notification/notifictaioncontainer';

import { login, register, auth } from '../actions/auth';
import { fetchEvents, changeEvent } from '../actions/events';
import './app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const { auth, user, events, eventsStatus, fetchEvents } = this.props;
    const { authenticated } = user;
    const token = localStorage.getItem('token');
    if (!token) return <Redirect to='/login' />;
    if (token && !authenticated) auth(token);
    if (!events.length && !eventsStatus) fetchEvents();

    this.removeNotification = this.removeNotification.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
  }

  getNotifications() {
    const { events } = this.props;
    const now = new Date();
    return events.reduce((prev, event, ndx) => {
      const date = event.dateBegin;
      const time = event.timeBegin || new Date(1970, 0, 1, 0, 0);
      const begin = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes() - 5);
      const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
      if (now - end > 0 || !event.notification) return prev;
      prev.push({
        begin: new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes() - 5),
        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes()),
        id: event._id
      });
      return prev;
    }, []).sort((event1, event2) => event2.time - event1.time);
  }

  removeNotification(id) {
    const { changeEvent } = this.props;
    changeEvent({ id: id, event: {notification: false} });
  }

  render() {
    const { events } = this.props;
    const { getNotifications, removeNotification } = this;
    return (
      <div className="container">
        <Sidebar />
        <div className="content">
          <Controls />
          <Body />
        </div>
        <NotificationContainer notifications={getNotifications()} events={events} removeNotification={removeNotification} />
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
  fetchEvents,
  changeEvent
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
