import React from 'react';
import PropTypes from 'prop-types';

import dragAndDrop from '../../../hoc/dragndrop.jsx';

import WeekHourEvent from './weekhourevent.jsx';

import './weekday.scss';

class WeekDay extends React.Component {
  render() {
    const { id, events, getHours, weekend, eventDragAndDrop, setEventsPositions, setEventsSizes, groups } = this.props;
    const hours = getHours(events);
    return (
      <li id='day' className={`week__day${weekend ? ' week__day_weekend' : ''}`}>
        <ul className='week__hours'>
          {
            hours.map(hour => {
              const eventsWithSize = setEventsSizes(hour.events);
              const events = setEventsPositions(eventsWithSize);
              return (
                <li className='week__hour week-hour' key={hour.time.format('HHmm')}>
                  <div
                    className='week-hour__body'
                    data-dd='true'
                    data-time={hour.time.format('HH:00')}
                    data-date={id}
                  >
                    {
                      events.map((event, ndx) => {
                        const color = event.group && groups.find(group => group._id === event.group).color;
                        return <WeekHourEvent {...event} key={ndx} color={color} eventDragAndDrop={eventDragAndDrop} />
                      })
                    }
                  </div>
                </li>
              );
            })
          }
        </ul>
      </li>
    );
  }
}

WeekDay.propTypes = {
  events: PropTypes.array,
  id: PropTypes.string,
  eventDragAndDrop: PropTypes.func,
  setEventsPositions: PropTypes.func,
  setEventsSizes: PropTypes.func,
  getHours: PropTypes.func
};

export default dragAndDrop(WeekDay);