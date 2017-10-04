import React, { PropTypes } from 'react';
import { MONTH_NAMES } from '../../../constants/calendar.js';

class MonthDay extends React.Component {
  constructor(props) {
    super(props);
    this.removeSelectedDate = this.removeSelectedDate.bind(this);
  }

  componentDidMount() {
    const { getCellHeight } = this.props;
    if (this.body) getCellHeight(this.body);
  }

  removeSelectedDate(e) {
    e.stopPropagation();
    const {changeSelectedDate} = this.props;
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
      onDateClick,
      onAddClick,
      onDayClick,
      changeSelectedDate,
      eventDragAndDrop
    } = this.props;
    
    const { removeSelectedDate } = this;
    return (
      <li
        id='day'
        data-date={id}
        className={`month__day month-day${current ? ' month-day_active' : ''}${today ? ' month-day_today' : ''}${hover ? ' month-day_hover' : ''}`}
        data-dd='true'
        onClick={onDayClick}
      >
        <div className='month-day__head'>
          <span id='day-date' className='month-day__num' onClick={onDateClick}>{date.date()}</span>
          <span id='add-event' className='month-day__add' onClick={onAddClick}>+</span>
        </div>
        <div className='month-day__body' ref={(body) => {this.body = body;}}></div>
        <div className={`month-day__all-events ${selected ? '' : 'month-day__all-events_hidden'}`}>
          <span className='month-day__full-date'>{date.format('DD MMMM YYYY')}</span>
          <span className='month-day__close' onClick={removeSelectedDate}><i className="fa fa-times" aria-hidden="true"></i></span>
          {
            events.map(event => {
              return ((event.periodic && event.week[date.day() ? date.day() - 1 : 6])
                || !event.periodic)
                && <span className='week-events__item' key={event._id} id={event._id} onMouseDown={eventDragAndDrop}>{event.title}</span>;
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
  getCellHeight: PropTypes.func,
  changeSelectedDate: PropTypes.func
};

export default MonthDay;