import React, { PropTypes } from 'react';


const Event = ({ title, description, time, date, group, onCogClick }) => (
  <li className='side-events__item side-event'>
    <div className='side-event__group'>
      <span className='side-event__group-color' style={{ 'backgroundColor': group && group.color ? group.color :'#fff' }}>{ group && group.name ? group.name : '' }</span>
    </div>
    <div className='side-event__content'>
      <div className='side-event__descr'>
        <h4 className='side-event__title'>{title}</h4>
        <span className='side-event__change fa fa-cog' onClick={onCogClick}></span>
        <span className='side-event__text'>{description}</span>
      </div>
      <div className='side-event__time-cont'>
        <time className='side-event__time'>
          {time}
        </time>
      </div>
    </div>
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