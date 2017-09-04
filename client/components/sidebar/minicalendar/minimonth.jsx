import React from 'react';
import MiniDay from './miniday.jsx';
import { getMonthInfo, getFirstDays, getWeek } from '../../../utils.js';
import { WEEKDAYS } from '../../../constants/calendar.js'

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
      if (array.length && (firstDays[ndx - 1] <= date && firstDay > date))
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
      <div className='mini'>
        <header className='mini__weekdays weekdays'>
          <ul className='weekdays__list weekdays__list_mini'>
            {WEEKDAYS.map((day, ndx) => (
              <li className='weekdays__item weekdays__item_mini' key={ndx}>{day}</li>
            ))}
          </ul>
        </header>
        {
          month.dates.map((week, ndx) => {
            return (
              <li className='mini__item' key={ndx} >
                <ul className={`mini__week ${month.activeWeek === ndx ? 'mini__week_active' : ''}`}>
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
      </div>
    );
  }
}