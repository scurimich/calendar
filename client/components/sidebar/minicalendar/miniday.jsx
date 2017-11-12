import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './miniday.scss';

const MiniDay = ({ date, currentDate, currentSpace, onDayClick }) => (
  <li
    className={classNames(
      'sidebar-week__day',
      'sidebar-day',
      {
        'sidebar-day_active': currentDate,
        'sidebar-day_not-current': !currentSpace
      }
      )}
    onClick={onDayClick}
  >
    <span className='sidebar-day__number'>{date.date()}</span>
  </li>
);

MiniDay.propTypes = {
  date: PropTypes.object,
  currentDate: PropTypes.bool,
  onDayClick: PropTypes.func
};

export default MiniDay;