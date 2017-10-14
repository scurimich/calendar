import React from 'react';
import PropTypes from 'prop-types';
import MiniDay from './miniday.jsx';
import { getMonthInfo, getFirstDays, getWeek } from '../../../utils.js';
import { WEEKDAYS } from '../../../constants/calendar.js'

import './minimonth.scss';

export default class MiniMonth extends React.Component {
  constructor(props) {
    super(props);
  }

  getMonth() {
    const { date, miniSpace } = this.props;
    const monthInfo = getMonthInfo(miniSpace);
    const firstDays = getFirstDays(monthInfo);
    let activeWeek;
    const dates = firstDays.reduce((array, firstDay, ndx, firstDays) => {
      if (array.length && (firstDays[ndx - 1].isSameOrBefore(date) && firstDay.isAfter(date)))
        activeWeek = ndx - 1;
      array.push(getWeek({ firstDay, date }));
      return array;
    }, []);
    return {
      activeWeek,
      dates
    };
  }

  render() {
    const { date, setCurrentDate } = this.props;
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
  monthInfo: PropTypes.object,
  setCurrentDate: PropTypes.func
};