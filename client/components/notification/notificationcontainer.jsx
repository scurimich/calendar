import React from 'react';
import PropTypes from 'prop-types';
import Notification from 'react-web-notification/lib/components/Notification';
import moment from 'moment';

export default class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ignore: true,
      title: ''
    };

    this.tick = this.tick.bind(this);
    this.norifOnClose = this.norifOnClose.bind(this);
    this.permissionGranted = this.permissionGranted.bind(this);
    this.permissionDenied = this.permissionDenied.bind(this);
  }

  componentWillMount() {
    this.setState({interval: setInterval(this.tick, 1000)});
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  tick() {
    const { ignore } = this.state;
    const { notifications, events } = this.props;
    if (ignore || !notifications.length) return;
    const nextNotif = notifications[notifications.length - 1];
    const now = moment();
    if (now - nextNotif.begin >= 0 && now - nextNotif.end < 0) {
      const event = events.find(val => val._id === nextNotif.id);
      const options = {
        body: event.description,
        tag: event._id,
        lang: 'en',
        dir: 'ltr'
      }
      this.setState({
        title: `${event.title} begins in ${event.timeBegin.hours()}:${event.timeBegin.minutes()}`,
        options
      });
    }
  }

  permissionGranted() {
    this.setState({
      ignore: false
    });
  }

  permissionDenied() {
    this.setState({
      ignore: true
    });
  }

  norifOnClose() {
    const { notifications, removeNotification } = this.props;
    const lastId = notifications[notifications.length - 1].id;
    notifications.pop();
    removeNotification(lastId);
  }

  render() {
    const { norifOnClose, permissionGranted, permissionDenied } = this;
    return <Notification
      {...this.state}
      onClose={norifOnClose}
      onPermissionGranted={permissionGranted}
      onPermissionDenied={permissionDenied}
    />
  }
}

NotificationContainer.propTypes = {
  events: PropTypes.array,
  notifications: PropTypes.array,
  removeNotification: PropTypes.func
};