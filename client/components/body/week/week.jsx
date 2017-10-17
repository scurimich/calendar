import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GeminiScrollbar from 'react-gemini-scrollbar';
import moment from 'moment';

import WeekDay from './weekday.jsx';
import {DAYS_IN_WEEK, WEEKDAYS} from '../../../constants/calendar.js';
import { getWeekEvents } from '../../../utils.js';
import calendarInfo from '../../../hoc/calendarinfo.jsx';

import './Week.scss';

class Week extends React.Component {
  constructor(props) {
    super(props);
    const { date, monthInfo } = this.props;
    this.prevDays = monthInfo.previous.extraDays;
    this.curNumber = monthInfo.current.days;
  }

  getWeek() {
    const { space, date } = this.props;
    const { prevDays, curNumber } = this;
    const week = [];
    const year = space.year();
    const month = space.month();
    const day = space.day() == 0 ? 6 : space.day() - 1;
    let oneDay = day == 1 ? space : space.clone().subtract(day, 'days');

    for (let i = 1; i <= DAYS_IN_WEEK; oneDay.clone().add(1, 'days'), i++) {
      const currentDay = oneDay.format('YYYY,MM,DD');
      let currentHover;
      const current = oneDay - date === 0;

      week.push({
        date: oneDay,
        id: currentDay,
        current: current
      });
    }

    return week;
  }

  dayEvents(date) {
    const { events } = this.props;
    return events.filter(event => {
      return event.duration === 0
        && (event.dateBegin - date === 0);
    });
  }

  weekEvents() {
    const { events } = this.props;
    return events.filter(event => {
      return event.duration > 0;
    });
  }

  renderAllDayEvents() {
    const { space } = this.props;
    const day = space.day() == 0 ? 6 : space.day() - 1;
    const firstDay = day == 1 ? space : space.clone().subtract(day, 'days');
    const weekEvents = getWeekEvents(this.weekEvents(), firstDay);
    const lines = (weekEvents && weekEvents.lines) || [];
    console.log(lines)
    return lines.map((line, ndx) => {
      return (
        <li key={ndx} className='week-events__line'>
          {
            line.map((item, ndx) => {
              const offset = (
                <span className={`week-events__offset week-events__offset_${item.size}`} key={ndx}></span>
              );

              if (!item._id) 
                return offset;

              const color = item.group && item.group.color;
              const time = item.allDay ? '' : `${item.timeBegin.format('HH:mm')} - ${item.timeEnd.format('HH:mm')}`;

              return (
                <div
                  className={`week-events__item week-events__item_size-${item.size}${item.hidden ? ' week-events__item_hidden' : ''} week-event`} 
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
      );
    });
  }

  getSidebar() {
    const { space } = this.props;
    const nextDay = space.clone().add(1, 'days');
    const halfHours = [];
    let currentTime = space;

    while(currentTime.isBefore(nextDay)) {
      halfHours.push(currentTime.clone());
      currentTime.add(60, 'minutes');
    }

    return halfHours;
  }

  render() {
    const { getWeek, space, date } = this.props;
    const week = getWeek({space, date});
    const sidebar = this.getSidebar();
    const alldayEvents = this.renderAllDayEvents();

    return (
      <div className='body__week week'>
        <ul className='week__weekdays'>
          {
            WEEKDAYS.map((day, ndx) => (
              <li className='week__weekday' key={ndx}>{day}</li>
            ))
          }
        </ul>
        <div className='week__scroll-container'>
          <GeminiScrollbar className='week__scrollbar'>
            <div className='week__events week-events'>
              <ul className='week-events__list'>
                { alldayEvents }
                <ul className='week-events__days'>
                  {
                    WEEKDAYS.map((day, ndx) => (
                      <li className='week-events__day' key={ndx}></li>
                    ))
                  }
                </ul>
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
              <ul className='week__main'>
                {
                  week.map((day, ndx) => {
                    return (<WeekDay
                      {...day}
                      events={this.dayEvents(day.date)}
                      key={ndx}
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
  date: PropTypes.object,
  space: PropTypes.object
};

const mapStateToProps = state => ({
  date: state.date,
  space: state.space.main
});

export default connect(mapStateToProps, null)(calendarInfo(Week));