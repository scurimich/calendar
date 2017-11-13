import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import moment from 'moment';

import { auth } from '../actions/auth.js';
import { fetchEvents, updateEvent } from '../actions/events.js';
import { fetchGroups } from '../actions/groups.js';

import Sidebar from './sidebar/sidebar.jsx';
import Controls from './controls/controls.jsx';
import Body from './body/body.jsx';
import NotificationContainer from './notification/notificationcontainer.jsx';

import './app.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.removeNotification = this.removeNotification.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
  }

  componentDidMount() {
    const { auth, user } = this.props;
    const token = localStorage.getItem('token');

    if (token && !user.authenticated) return auth(token);
    this.getUserContent();
  }

  componentDidUpdate() {
    this.getUserContent();
  }

  getUserContent() {
    const { user, eventsStatus, events, fetchEvents, groups, fetchGroups, groupsStatus } = this.props;
    const { authenticated } = user;

    if (authenticated && !groups.length && !groupsStatus) fetchGroups();
    if (authenticated && !events.length && !eventsStatus) fetchEvents();
  }

  getNotifications() {
    const { events } = this.props;
    const now = moment();
    return events.reduce((prev, event, ndx) => {
      const date = event.dateBegin;
      const time = event.timeBegin || moment(0, 'HH');
      const begin = date.clone().hours(time.hours()).minutes(time.minutes() - 5);
      const end = date.clone().hours(time.hours()).minutes(time.minutes());
      if (now - end > 0 || !event.notification) return prev;
      prev.push({
        begin: begin,
        end: end,
        id: event._id
      });
      return prev;
    }, []).sort((event1, event2) => event2.time - event1.time);
  }

  removeNotification(id) {
    console.log(this)
    const { updateEvent } = this.props;
    updateEvent({ id: id, event: {notification: false} });
  }

  render() {
    const token = localStorage.getItem('token');

    if (!token) return <Redirect to='/login' />;
    const { getNotifications, removeNotification } = this;
    const { user, events } = this.props;
    const { authenticated } = user;

    const waiting = (
      <div className='waiting'><span className='waiting__spinner'></span></div>
    );

    const application = (
      <div className="content">
        <div className='content__sidebar'>
          <Sidebar />
        </div>
        <div className="content__main">
          <Controls />
          <Body />
        </div>
        <NotificationContainer
          notifications={getNotifications()}
          events={events}
          removeNotification={removeNotification}
        />
      </div>
    );
    
    return authenticated ? application : waiting;
  }
}

App.propTypes = {
  user: PropTypes.object,
  events: PropTypes.array,
  eventsStatus: PropTypes.string,
  groups: PropTypes.array,
  groupsStatus: PropTypes.string,
  auth: PropTypes.func,
  fetchEvents: PropTypes.func,
  updateEvent: PropTypes.func,
  fetchGroups: PropTypes.func
}


const mapStateToProps = state => ({
  user: state.user,
  events: state.events,
  eventsStatus: state.eventsStatus.status,
  groups: state.groups,
  groupsStatus: state.groupsStatus.status
});

const mapDispatchToProps = dispatch => bindActionCreators({
  auth,
  fetchEvents,
  updateEvent,
  fetchGroups
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
