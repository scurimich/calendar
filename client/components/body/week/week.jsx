import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GeminiScrollbar from 'react-gemini-scrollbar';
import WeekDay from './weekday.jsx';
import {DAYS_IN_WEEK, WEEKDAYS} from '../../../constants/calendar.js';
import {addNull, getWeekEvents} from '../../../utils.js';

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
    const year = space.getFullYear();
    const month = space.getMonth();
    const day = space.getDay() == 0 ? 6 : space.getDay() - 1;
    let oneDay = day == 1 ? space : new Date(space.getFullYear(), space.getMonth(), space.getDate() - day);

    for (let i = 1; i <= DAYS_IN_WEEK; oneDay = new Date(oneDay.getFullYear(), oneDay.getMonth(), oneDay.getDate() + 1), i++) {
      const currentYear = oneDay.getFullYear();
      const currentMonth = addNull(oneDay.getMonth() + 1);
      const currentDate = addNull(oneDay.getDate());
      const currentDay = `${currentYear},${currentMonth},${currentDate}`;
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

  // // weekClasses() {
  // //   const { date, curDate } = this.props;
  // //   const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + DAYS_IN_WEEK);
  // //   const currentDate = curDate;
  // //   const active = currentDate >= date && currentDate < nextDate;
  // //   const classArray = [
  // //     'week__week',
  // //     active ? 'week__week_active' : ''
  // //   ];
  // //   return classArray.join(' ');
  // // }

  renderAllDayDays() {
    return this.getWeek().map((day, ndx) => {
      return (
        <li className='week__allday-day' key={ndx}></li>
      );
    });
  }

  renderAllDayEvents() {
    const { space } = this.props;
    const day = space.getDay() == 0 ? 6 : space.getDay() - 1;
    const firstDay = day == 1 ? space : new Date(space.getFullYear(), space.getMonth(), space.getDate() - day);
    const lines = getWeekEvents(this.weekEvents(), firstDay).lines || [];
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
    const nextDay = new Date(space.getFullYear(), space.getMonth(), space.getDate() + 1);
    const halfHours = [];
    let currentTime = space;

    while(currentTime - nextDay < 0) {

      const currentHour = currentTime.getHours() > 12 ? currentTime.getHours() - 12 : currentTime.getHours();

      halfHours.push(
        <li className='week__sb-hour sb-hour' key={`${currentTime.getHours()}${currentTime.getMinutes()}`}>
          <div className='sb-hour__time'>
            {`${currentTime.getHours() ? currentHour : 12}${currentTime.getHours() <= 12 ? 'AM' : 'PM'}`}
          </div>
        </li>
      );
      currentTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), currentTime.getMinutes() + 60);
    }

    return halfHours;
  }

  render() {
    const { selectedEvent } = this.props;
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
                    selectedEvent={this.props.selectedEvent}
                    onMouseDown={this.props.eventDragAndDrop}
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
  space: state.space.main
});

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Week);