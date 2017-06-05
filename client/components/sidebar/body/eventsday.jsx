import React from 'react';
import { TODAY, FULL_WEEKDAYS } from '../../../constants/calendar';

import Event from './event.jsx';

class EventsDay extends React.Component {
  constructor(props) {
    super(props);
  }

  formatDate(date) {
    return `${date === TODAY ? 'Today' : FULL_WEEKDAYS[date.getDay()].toUpperCase()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  render() {
    const { date, events } = this.props;
    // console.log(events)
    return (
      <li className='side-events__day event-day'>
        <h3 className='event-day__title'>{this.formatDate(date)}</h3>
        <ul className='event-day__list'>
          {events.map((event, key) => <Event {...event} key={key} />)}
        </ul>
      </li>
    );
  }
};

export default EventsDay;