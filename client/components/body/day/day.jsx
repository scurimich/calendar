import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GeminiScrollbar from 'react-gemini-scrollbar';
import classNames from 'classnames';

import calendarInfo from '../../../hoc/calendarinfo.jsx';
import dragAndDrop from '../../../hoc/dragndrop.jsx';
import events from '../../../hoc/events.jsx';

import HourEvent from './hourevent.jsx';

import './day.scss';

class Day extends React.Component {
  modifiedTimeEvents(events) {
    const { setEventsSizes, filterTime } = this.props;
    const timeEvents = filterTime(events);
    return setEventsSizes(timeEvents);
  }

  getAllDayEvents(events) {
    const { groups, filterAllDay } = this.props;
    return filterAllDay(events).map(event => {
      const group = groups.find(group => group._id === event.group);
      return {...event, group};
    });
  }

  render() {
    const {
      space,
      events,
      getHours,
      filterDate,
      eventDragAndDrop,
      setEventsPositions,
      selectedEvent
    } = this.props;
    const filteredEvents = filterDate({date: space, events});
    const allDayEvents = this.getAllDayEvents(filteredEvents);
    const modifiedEvents = this.modifiedTimeEvents(filteredEvents);
    const hours = getHours(modifiedEvents);

    return (
      <div className='body__day day' id='day'>
          <div className='day__scroll-container'>
            <GeminiScrollbar className='day__scrollbar'>
              <ul className='day__events day-events'>
                {
                  allDayEvents.map(event => {
                    const color = event.group && event.group.color;
                    const groupName = event.group ? event.group.label : '';

                    return (
                      <li className='day-events__event' key={event._id}>
                        <div className='day-events__background' style={ color ? {'backgroundColor': color} : {} }></div>
                        <span className='day-events__title'>{event.title}</span>
                        <p className='day-events__description'>{event.description}</p>
                      </li>
                    );
                  })
                }
              </ul>
              <ul className='day__list' data-dnd>
                {
                  hours.map(hour => {
                    const events = setEventsPositions(hour.events);
                    const nextHour = hour.time.clone().add(1, 'hours');
                    const hover = selectedEvent && selectedEvent.timeBegin.isBefore(nextHour) && selectedEvent.timeEnd.isAfter(hour.time);
                    const hourClasses = classNames('day__hour', 'day-hour', {
                      'day-hour_hover': hover
                    });
                    
                    return (
                      <li
                        className={hourClasses}
                        key={hour.time.format('HHmm')}
                        data-key={hour.time.format('HHmm')}
                      >
                        <div className='day-hour__time'>
                          {hour.time.format('h:00 A')}
                        </div>
                        <div 
                          className='day-hour__body'
                          data-dd='true'
                          data-time={hour.time.format('HH:mm')}
                        >
                          {
                            events.map((event, ndx) => (
                              <HourEvent
                                {...event}
                                key={ndx}
                                eventDragAndDrop={eventDragAndDrop}
                                selected={selectedEvent && selectedEvent._id === event._id}
                              />
                            ))
                          }
                        </div>
                      </li>
                    );
                  })
                }
              </ul>
            </GeminiScrollbar>
          </div>
      </div>
    );
  }
}

Day.propTypes = {
  events: PropTypes.array,
  groups: PropTypes.array,
  space: PropTypes.object,
  getHours: PropTypes.func,
  filterDate: PropTypes.func,
  filterAllDay: PropTypes.func,
  filterTime: PropTypes.func,
  setEventsSizes: PropTypes.func,
  setEventsPositions: PropTypes.func,
  eventDragAndDrop: PropTypes.func
};

const mapStateToProps = state => ({
  events: state.events,
  groups: state.groups,
  space: state.space.main,
  selectedEvent: state.selected
});

export default connect(mapStateToProps, null)(calendarInfo(dragAndDrop(events(Day))));