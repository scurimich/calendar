import React from 'react';
import PropTypes from 'prop-types';

import MiniDay from './miniday.jsx';
import { WEEKDAYS } from '../../../constants/calendar.js'
import calendarInfo from '../../../hoc/calendarinfo.jsx';

import './minimonth.scss';

class MiniMonth extends React.Component {
  constructor(props) {
    super(props);
  }

  getMonth() {
    const { date, space, getWeeks, getWeek } = this.props;
    const weeks = getWeeks(space);
    const month = {};
    month.dates = weeks.map((week, ndx) => {
      const weekInfo = getWeek({space: week, globalSpace: space, date});
      month.activeWeek = month.activeWeek || (weekInfo.find(week => week.currentDate) && ndx);
      return weekInfo;
    });

    return month;
  }

  render() {
    const { space, date, setCurrentDate } = this.props;
    const month = this.getMonth();

    return (
      <div className='sidebar-month'>
        <ul className='sidebar-month__weekdays'>
          {WEEKDAYS.map((day, ndx) => (
            <li className='sidebar-month__weekday' key={ndx}>{day}</li>
          ))}
        </ul>
        <ul className='sidebar-month__weeks'>
        {
          month.dates.map((week, ndx) => {
            return (
              <li className='sidebar-month__week sidebar-week' key={ndx} >
                <ul className={`sidebar-week__list${month.activeWeek === ndx ? ' sidebar-week__list_active' : ''}`}>
                {
                  week.map((day, key) => {
                    return (<MiniDay {...day} key={key} onDayClick={setCurrentDate.bind(null, day.date)} />);
                  })
                }
                </ul>
              </li>
            );
          })
        }
        </ul>
      </div>
    );
  }
}

MiniMonth.propTypes = {
  date: PropTypes.object,
  miniSpace: PropTypes.object,
  setCurrentDate: PropTypes.func
};

export default calendarInfo(MiniMonth);