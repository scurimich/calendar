import React from 'react';
import PropTypes from 'prop-types';

import './miniday.scss';

const MiniDay = ({ date, currentDate, currentSpace, onDayClick }) => (
  <li className={`sidebar-week__day sidebar-day${currentDate ? ' sidebar-day_active' : ''}${!currentSpace ? ' sidebar-day_not-current': ''}`} onClick={onDayClick}>
    <span className={`sidebar-day__number`}>{date.date()}</span>
  </li>
);

MiniDay.propTypes = {
  date: PropTypes.object,
  currentDate: PropTypes.bool,
  onDayClick: PropTypes.func
};

export default MiniDay;