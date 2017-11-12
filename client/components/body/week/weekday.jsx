import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dragAndDrop from '../../../hoc/dragndrop.jsx';

import WeekHourEvent from './weekhourevent.jsx';

import './weekday.scss';

class WeekDay extends React.Component {
  render() {
    const {
      date,
      id,
      events,
      getHours,
      weekend,
      eventDragAndDrop,
      setEventsPositions,
      setEventsSizes,
      groups,
      selectedEvent
    } = this.props;
    const hours = getHours(events);
    
    return (
      <li id='day' className={classNames('week__day', {'week__day_weekend': weekend})}>
        <ul className='week__hours'>
          {
            hours.map(hour => {
              const eventsWithSize = setEventsSizes(hour.events);
              const events = setEventsPositions(eventsWithSize);
              const nextHour = hour.time.clone().add(1, 'hours');
              const hover = selectedEvent && selectedEvent.dateBegin.isSame(date) && selectedEvent.timeBegin.isBefore(nextHour) && selectedEvent.timeEnd.isAfter(hour.time);

              return (
                <li
                  className={classNames('week__hour', 'week-hour', {'week-hour_hover': hover})}
                  key={hour.time.format('HHmm')}
                >
                  <div
                    className='week-hour__body'
                    data-dd='true'
                    data-time={hour.time.format('HH:00')}
                    data-date={id}
                  >
                    {
                      events.map((event, ndx) => {
                        const color = event.group && groups.find(group => group._id === event.group).color;
                        return (
                          <WeekHourEvent
                            {...event}
                            key={ndx}
                            color={color}
                            eventDragAndDrop={eventDragAndDrop}
                            selected={selectedEvent && selectedEvent._id === event._id}
                          />
                        );
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