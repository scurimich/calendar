import React, { PropTypes } from 'react';

const MiniDay = ({ date, currentDate, onDayClick }) => (
  <li className={`mini-day mini__day ${currentDate ? 'mini__day_active' : ''}`} onClick={onDayClick}>
    <span className={`mini-day__num`}>{date.getDate()}</span>
  </li>
);

MiniDay.propTypes = {
  date: PropTypes.object,
  currentDate: PropTypes.bool,
  onDayClick: PropTypes.func
};

export default MiniDay;