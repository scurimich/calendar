import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GeminiScrollbar from 'react-gemini-scrollbar';
import moment from 'moment';
import classNames from 'classnames';

import { WEEKDAYS } from '../../../constants/calendar.js';
import calendarInfo from '../../../hoc/calendarinfo.jsx';
import events from '../../../hoc/events.jsx';

import WeekDay from './weekday.jsx';

import './week.scss';

class Week extends React.Component {
  getAllDayEvents(events) {
    const { space, getWeekLines, filterDays, groups } = this.props;
    const day = space.day() ? space.day() - 1 : 6;
    const firstDay = day == 1 ? space.clone() : space.clone().subtract(day, 'days');

    const filteredEvents = filterDays(events).map(event => {
      if (!event.group) return event;
      const group = groups.find(group => group._id === event.group);
      return {...event, group};
    });
    const weekEvents = getWeekLines({data: filteredEvents, date: firstDay});
    return (weekEvents && weekEvents.lines) || [];
  }

  getSidebar() {
    const { space } = this.props;
    const nextDay = space.clone().add(1, 'days');
    const halfHours = [];
    let currentTime = space.clone();

    while(currentTime.isBefore(nextDay)) {
      halfHours.push(currentTime.clone());
      currentTime.add(1, 'hours');
    }

    return halfHours;
  }

  getWeekDays(week) {
    return week.map(day => ({
      date: day.date,
      today: day.today,
      currentDate: day.currentDate
    }));
  }

  render() {
    const {
      events,
      getWeek,
      space,
      date,
      filterDay,
      filterWeek,
      getHours,
      setEventsPositions,
      setEventsSizes,
      groups,
      selectedEvent
    } = this.props;
    const day = space.day() ? space.day() - 1 : 6;
    const weekBegin = space.clone().subtract(day, 'days');
    const filteredEvents = filterWeek({events, weekBegin});
    const week = getWeek({space, date});
    const sidebar = this.getSidebar();
    const lines = this.getAllDayEvents(filteredEvents);
    const weekDays = this.getWeekDays(week);

    return (
      <div className='body__week week'>
        <ul className='week__weekdays'>
          {
            weekDays.map((day, ndx) => (
              <li className='week__weekday' key={ndx}>
                {day.date.format('ddd (DD.MM)')}
              </li>
            ))
          }
        </ul>
        <div className='week__scroll-container'>
          <GeminiScrollbar className='week__scrollbar'>
            <div className='week__events week-events'>
              <ul className='week-events__list'>
                {
                  lines.map((line, ndx) => (
                    <li key={ndx} className='week-events__line'>
                      {
                        line.map((item, ndx) => {
                          if (!item._id) 
                            return <span className={classNames('week-events__offset', `week-events__offset_${item.size}`)} key={ndx}></span>

                          const color = item.group && item.group.color;
                          const time = item.allDay ? '' : `${item.timeBegin.format('HH:mm')} - ${item.timeEnd.format('HH:mm')}`;

                          return (
                            <div
                              className={classNames(
                                'week-events__item',
                                'week-event',
                                `week-events__item_size-${item.size}`,
                                {'week-events__item_hidden': item.hidden}
                              )} 
                              key={ndx}
                              id={item._id}
                            >
                              <div
                                className='week-event__background'
                                style={ color ? {'backgroundColor': color} : {} }
                              ></div>
                              <span className='week-event__title'>{item.title}</span>
                              <span className='week-event__description'>{item.description}</span>
                              <span className='week-event__time'>{time}</span>
                            </div>
                          );
                        })
                      }
                    </li>
                  ))
                }
              </ul>
              <ul className='week-events__days'>
                {
                  WEEKDAYS.map((day, ndx, days) => (
                    <li
                      className={
                        `week-events__day
                        ${days.length - 2 <= ndx ? ' week-events__day_weekend' : ''}`
                      }
                      key={ndx}
                    ></li>
                  ))
                }
              </ul>
            </div>
            <div className='week__body'>
              <div className='week__sidebar'>
                {
                  sidebar.map(hour => (
                    <li className='week__time' key={hour.format('HHmm')}>
                      {hour.format('h:00 A')}
                    </li>
                  ))
                }
              </div>
              <ul className='week__main' data-dnd>
                {
                  week.map((day, ndx) => {
                    return (<WeekDay
                      {...day}
                      events={filterDay({date: day.date, events: filteredEvents})}
                      groups={groups}
                      key={ndx}
                      getHours={getHours}
                      setEventsPositions={setEventsPositions}
                      setEventsSizes={setEventsSizes}
                      selectedEvent={selectedEvent}
                    />);
                  })
                }
              </ul>
            </div>
          </GeminiScrollbar>
        </div>
      </div>
    );
  }
}

Week.propTypes = {
  events: PropTypes.array,
  groups: PropTypes.array,
  date: PropTypes.object,
  space: PropTypes.object,
  getWeekLines: PropTypes.func,
  getWeek: PropTypes.func,
  filterWeek: PropTypes.func,
  filterDay: PropTypes.func,
  filterDays: PropTypes.func,
  getHours: PropTypes.func,
  setEventsPositions: PropTypes.func,
  setEventsSizes: PropTypes.func
};

const mapStateToProps = state => ({
  date: state.date,
  space: state.space.main,
  events: state.events,
  groups: state.groups,
  selectedEvent: state.selected
});

export default connect(mapStateToProps, null)(calendarInfo(events(Week)));