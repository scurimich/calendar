import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './hourevent.scss';

const HourEvent = ({_id, height, width, top, left, zIndex, color, title, description, timeBegin, timeEnd, eventDragAndDrop, selected}) => (
  <div
    className={classNames('day-hour__event', 'hour-event', {'hour-event_selected': selected})}
    id={_id}
    style={ {'height': height + '%','width': width + '%', 'top': top + '%', 'left': left + '%', 'zIndex': zIndex} }
    onMouseDown={eventDragAndDrop}
  >
    <div
      className='hour-event__background'
      style={ color ? {'backgroundColor': color} : {} }
    ></div>
    <span className='hour-event__title'>{title}</span>
    <span className='hour-event__description'>{description}</span>
    <span className='hour-event__time'>
      {`${timeBegin.format('HH:mm')} - ${timeEnd.format('HH:mm')}`}
    </span>
  </div>
);

HourEvent.propTypes = {
  _id: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
  zIndex: PropTypes.number,
  color: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  timeBegin: PropTypes.object,
  timeEnd: PropTypes.object,
  eventDragAndDrop: PropTypes.func
}

export default HourEvent;