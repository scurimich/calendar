import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GeminiScrollbar from 'react-gemini-scrollbar';
import moment from 'moment';

import WeekDay from './weekday.jsx';
import {DAYS_IN_WEEK, WEEKDAYS} from '../../../constants/calendar.js';
import {addNull, getWeekEvents} from '../../../utils.js';
import { selectEvent, changeSelectedEvent, removeEventSelection } from '../../../actions/selectedevent.js';
import { updateEvent } from '../../../actions/events.js';

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

  renderAllDayDays() {
    return this.getWeek().map((day, ndx) => {
      return (
        <li className='week__allday-day' key={ndx}></li>
      );
    });
  }

  renderAllDayEvents() {
    const { space } = this.props;
    const day = space.day() == 0 ? 6 : space.day() - 1;
    const firstDay = day == 1 ? space : space.clone().subtract(day, 'days');
    const weekEvents = getWeekEvents(this.weekEvents(), firstDay);
    const lines = (weekEvents && weekEvents.lines) || [];
    return lines.map((line, ndx) => {
      return (
        <li key={ndx} className='week-events__line'>
          {
            line.map((item, ndx) => {
              if (!item._id) 
                return (
                  <span className={`week-events__offset week-events__offset_${item.size}`} key={ndx}>
                  </span>
                );
              return (
                <span
                  className={this.eventClasses(item)} 
                  key={ndx}
                  id={item._id}
                >
                  {item.title}
                </span>
              );
            })
          }
        </li>
      );
    });
  }

  eventClasses(item) {
    return `week-events__item
      week-events__item_size-${item.size}
      ${item.hidden ? 'week-events__item_hidden' : ''}`;
  }

  renderSidebar() {
    const { space } = this.props;
    const nextDay = space.clone().add(1, 'days');
    const halfHours = [];
    let currentTime = space;

    while(currentTime - nextDay < 0) {

      halfHours.push(
        <li className='week__sb-hour sb-hour' key={currentTime.format('HHmm')}>
          <div className='sb-hour__time'>
            {currentTime.format('h:00 A')}
          </div>
        </li>
      );

      currentTime = currentTime.clone().add(60, 'minutes');
    }

    return halfHours;
  }

  render() {
    const { selectedEvent, selectEvent, updateEvent, changeSelectedEvent, removeEventSelection } = this.props;
    return (
      <div className='week'>
        <header className='week__head weekdays'>
          <ul className='weekdays__list weekdays__list_week'>
            {WEEKDAYS.map((day, ndx) => (
              <li className='weekdays__item weekdays__item_week' key={ndx}>{day}</li>
            ))}
          </ul>
        </header>
        <GeminiScrollbar>
          <div className='week__allday'>
            <ul className='week__allday-events'>
              {this.renderAllDayEvents()}
              <ul className='week__allday-days'>
                {this.renderAllDayDays()}
              </ul>
            </ul>
          </div>
          <div className='week__body'>
            <div className='week__sidebar'>
              {this.renderSidebar()}
            </div>
            <ul className='week__main'>
              {
                this.getWeek().map((day, ndx) => {
                  return (<WeekDay
                    events={this.dayEvents(day.date)}
                    key={ndx}
                    date={day.date}
                    id={day.id}
                    selectedEvent={selectedEvent}
                  />);
                })
              }
            </ul>
          </div>
        </GeminiScrollbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  date: state.date,
  space: state.space.main,
  selectedEvent: state.selected
});

export default connect(mapStateToProps, null)(Week);