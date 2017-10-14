import React from 'react';
import PropTypes from 'prop-types';

import './event.scss';

const Event = ({ title, description, allDay, timeBegin, timeEnd, group, onEventClick }) => (
  <li className='events__item event' onClick={onEventClick}>
    <div className='event__descr'>
      <span className='event__group' style={{ 'backgroundColor': group && group.color ? group.color :'#fff' }}>{ group && group.name ? group.name : '' }</span>
      <h4 className='event__title'>{title}</h4>
      <time className='event__time'>
        {allDay ? '': `${timeBegin.format('HH:mm')} - ${timeEnd.format('HH:mm')}`}
      </time>
    </div>
    <p className='event__text'>{description}</p>
  </li>
);

Event.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  time: PropTypes.string,
  date: PropTypes.string,
  group: PropTypes.object,
  onEventClick: PropTypes.func
}

export default Event;