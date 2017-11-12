import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './monthday.scss';

class MonthDay extends React.Component {
  constructor(props) {
    super(props);
    
    this.removeSelectedDate = this.removeSelectedDate.bind(this);
  }

  removeSelectedDate(e) {
    e.stopPropagation();
    const { changeSelectedDate } = this.props;
    changeSelectedDate();
  }

  render() {
    const {
      date,
      selected,
      events,
      current,
      today,
      hover,
      id,
      currentSpace,
      currentDate,
      weekend,
      onDateClick,
      onAddClick,
      onDayClick,
      changeSelectedDate,
      eventDragAndDrop,
    } = this.props;
    const { removeSelectedDate } = this;
    const dayClasses = classNames('month__day', 'month-day', {
      'month-day_active': currentDate,
      'month-day_today': today,
      'month-day_hover': hover,
      'month-day_notcurrent': !currentSpace,
      'month-day_weekend': weekend
    });
  
    return (
      <li
        id='day'
        data-date={id}
        className={dayClasses}
        data-dd='true'
        onClick={onDayClick}
      >
        <div className='month-day__head'>
          <span id='day-date' className='month-day__number' onClick={onDateClick}>{date.date()}</span>
          <span id='add-event' className='month-day__add' onClick={onAddClick}>+</span>
        </div>
        <div className='month-day__body' ref={(body) => {this.body = body;}}></div>
        <div className={classNames('month-day__all', {'month-day__all_hidden': !selected})}>
          <div className='month-day__info'>
            <span className='month-day__full'>{date.format('DD MMMM YYYY')}</span>
            <span className='month-day__close' onClick={removeSelectedDate}><i className="fa fa-times" aria-hidden="true"></i></span>
          </div>
          {
            events.map(event => {
              const color = event.group && event.group.color;

              return (
                <div
                  className='month-day__event'
                  key={event._id}
                  id={event._id}
                  onMouseDown={eventDragAndDrop}
                >
                  <div
                    className='month-day__event-back'
                    style={ color ? {'backgroundColor': color} : {} }
                  ></div>
                  {event.title}
                </div>
              );
            })
          }
        </div>
      </li>
    );
  }
}

MonthDay.propTypes = {
  date: PropTypes.object,
  current: PropTypes.bool,
  hover: PropTypes.bool,
  today: PropTypes.bool,
  id: PropTypes.string,
  onDateClick: PropTypes.func,
  onAddClick: PropTypes.func,
  onDayClick: PropTypes.func,
  changeSelectedDate: PropTypes.func
};

export default MonthDay;