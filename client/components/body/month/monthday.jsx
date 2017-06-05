import React, { PropTypes } from 'react';

const MonthDay = ({ date, current, today, hover, id, onDateClick, onAddClick, onDayClick }) => {
  return (
    <li
      id='day'
      data-date={id}
      className={`month__day month-day
        ${current ? 'month-day_active' : ''}
        ${today ? 'month-day_today' : ''}
        ${hover ? 'month-day_hover' : ''}
      `}
      data-dd='true'
      onClick={onDayClick}
    >
      <div className='month-day__head'>
        <span id='add-event' className='month-day__add' onClick={onAddClick}>+</span>
        <span id='day-date' className='month-day__num' onClick={onDateClick}>{date.getDate()}</span>
      </div>
        <div className='month-day__body'>
        </div>
    </li>
  );
}

MonthDay.propTypes = {
  date: PropTypes.object,
  current: PropTypes.bool,
  hover: PropTypes.bool,
  today: PropTypes.bool,
  id: PropTypes.string,
  onDateClick: PropTypes.func,
  onAddClick: PropTypes.func,
  onDayClick: PropTypes.func
};

export default MonthDay;