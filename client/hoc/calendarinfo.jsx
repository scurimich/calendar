import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { MONTH_IN_YEAR, NUMBER_OF_WEEKS, DAYS_IN_WEEK } from '../constants/calendar.js';

const calendarInfo = (Component) => {

  class CalendarInfoComponent extends React.Component {
    constructor(props) {
      super(props);
    }

    getMonthInfo() {
      const { space } = this.props;
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
        current,
        previous
      };
    }

    getWeeks() {
      const monthInfo = this.getMonthInfo();
      const extraDays = monthInfo.previous.extraDays;
      const year = extraDays ? monthInfo.previous.year : monthInfo.current.year;
      const month = extraDays ? monthInfo.previous.number : monthInfo.current.number;
      const date = extraDays ? monthInfo.previous.days - (extraDays - 1) : monthInfo.current.days;
      const weeks = [];
      let firstDay = moment([year, month, date]);

      for (let i = 0; i < NUMBER_OF_WEEKS; i++) {
        firstDays.push(firstDay.clone());
        firstDay.add(DAYS_IN_WEEK, 'days');
      }

      return weeks;
    }

    getWeek() {
      const weeks = this.getWeeks();
      const { space, date } = this.props;
      
      return weeks.map(firstDay => {
        const days = [];
        let oneDay = firstDay;

        for (let i = 0; i < DAYS_IN_WEEK; i++) {
          days.push({
            date: oneDay.clone(),
            currentDate: oneDay.isSame(date),
            currentSpace: space.month() === oneDay.month()
          });
          oneDay.add(1, 'days');
        }

        return days;
      });
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
      const {getMonthInfo, getWeeks, getWeek, getHours} = this;

      return (
        <Component
          {...this.props}
          getMonthInfo={getMonthInfo}
          getWeeks={getWeeks}
          getWeek={getWeek}
          getHours={getHours}
        />
      );
    }
  };

  CalendarInfoComponent.propTypes = {
    space: PropTypes.object,
    date: PropTypes.object
  };

  const mapStateToProps = state => ({
    space: state.space,
    date: state.date
  });

  return connect(mapStateToProps, null)(CalendarInfoComponent);
};

export default calendarInfo;