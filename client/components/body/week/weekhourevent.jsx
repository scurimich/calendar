import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './weekhourevent.scss';

const WeekHourEvent = ({_id, height, width, top, left, zIndex, color, title, timeBegin, timeEnd, eventDragAndDrop, selected}) => (
  <div
    className={classNames('week-hour__event', 'wh-event', {'wh-event_selected': selected})}
    id={_id}
    style={ {'height': height + '%','width': width + '%', 'top': top + '%', 'left': left + '%', 'zIndex': zIndex} } 
    onMouseDown={eventDragAndDrop}
  >
    <div
      className='wh-event__background'
      style={ color ? {'backgroundColor': color} : {} }
    ></div>
    <span className='wh-event__title'>{title}</span>
    <span className='wh-event__time'>
      {`${timeBegin.format('HH:mm')} - ${timeEnd.format('HH:mm')}`}
    </span>
  </div>
);

WeekHourEvent.propTypes = {
  _id: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
  zIndex: PropTypes.number,
  color: PropTypes.string,
  title: PropTypes.string,
  timeBegin: PropTypes.object,
  timeEnd: PropTypes.object,
  eventDragAndDrop: PropTypes.func
};

export default WeekHourEvent;