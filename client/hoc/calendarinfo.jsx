import React from 'react';
import moment from 'moment';

import { MONTH_IN_YEAR, NUMBER_OF_WEEKS, DAYS_IN_WEEK } from '../constants/calendar.js';

const calendarInfo = (Component) => {

  return class CalendarInfoComponent extends React.Component {
    constructor(props) {
      super(props);

      this.getWeeks = this.getWeeks.bind(this);
      this.getWeek = this.getWeek.bind(this);
    }

    getMonthInfo(space) {
      const current = {
        number: space.month(),
        days: space.clone().add(1, 'month').date(0).date(),
        firstDay: space.clone().date(1).day() || 7,
        year: space.year()
      }
      const previous = {
        number: space.clone().subtract(1, 'month').month(),
        days: space.clone().date(0).date(),
        extraDays: current.firstDay - 1,
        year: (space.month() == (MONTH_IN_YEAR - 1) && space.year() - 1) || space.year()
      }

      return {
        previous,
        current
      };
    }

    getWeeks(space) {
      const info = this.getMonthInfo(space);
      const extraDays = info.previous.extraDays;
      const year = extraDays ? info.previous.year : info.current.year;
      const month = extraDays ? info.previous.number : info.current.number;
      const date = extraDays ? info.previous.days - (extraDays - 1) : info.current.days;
      const weeks = [];
      let firstDay = moment([year, month, date]);

      for (let i = 0; i < NUMBER_OF_WEEKS; i++) {
        weeks.push(firstDay.clone());
        firstDay.add(DAYS_IN_WEEK, 'days');
      }

      return weeks;
    }

    getWeek({space, date}) {
      const days = [];
      const day = space.day() === 0 ? 6 : space.day() - 1;
      let oneDay = day == 1 ? space : space.clone().subtract(day, 'days');

      for (let i = 0; i < DAYS_IN_WEEK; i++) {
        days.push({
          date: oneDay.clone(),
          currentDate: oneDay.isSame(date),
          currentSpace: space.month() === oneDay.month(),
          id: oneDay.format('YYYY,MM,DD'),
          weekend: oneDay.day() === 0 || oneDay.day() === 6
        });
        oneDay.add(1, 'days');
      }

      return days;
    }

    getHours(events) {
      const hours = [];
      const nextDay = moment(0, 'HH').add(1, 'days');

      let currentTime = moment(0, 'HH');
      let nextTime = currentTime.clone().add(1, 'hours');

      while(currentTime.isBefore(nextDay)) {
        const currentEvents = events.filter(event => (
          event.timeBegin.isSameOrAfter(currentTime) && event.timeBegin.isBefore(nextTime)
        ));

        hours.push({
          time: currentTime,
          events: currentEvents
        });

        currentTime = nextTime.clone();
        nextTime.add(1, 'hours');
      }

      return hours;
    }

    render() {
      const {getWeeks, getWeek, getHours} = this;

      return (
        <Component
          {...this.props}
          getWeeks={getWeeks}
          getWeek={getWeek}
          getHours={getHours}
        />
      );
    }
  };
};

export default calendarInfo;