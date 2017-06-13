import React, { PropTypes } from 'react';

class MonthDay extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    const { getCellHeight } = this.props;
    if (this.body) getCellHeight(this.body);
  }

  render() {
    const { date, current, today, hover, id, onDateClick, onAddClick, onDayClick } = this.props;
    return (
      <li
        id='day'
        data-date={id}
        className={`month__day month-day${current ? ' month-day_active' : ''}${today ? ' month-day_today' : ''}${hover ? ' month-day_hover' : ''}`}
        data-dd='true'
        onClick={onDayClick}
      >
        <div className='month-day__head'>
          <span id='day-date' className='month-day__num' onClick={onDateClick}>{date.getDate()}</span>
          <span id='add-event' className='month-day__add' onClick={onAddClick}>+</span>
        </div>
          <div className='month-day__body' ref={(body) => {this.body = body;}}>
          </div>
      </li>
    );
  }
}
 // = ({ date, current, today, hover, id, onDateClick, onAddClick, onDayClick, getCellHeight }) => {

MonthDay.propTypes = {
  date: PropTypes.object,
  current: PropTypes.bool,
  hover: PropTypes.bool,
  today: PropTypes.bool,
  id: PropTypes.string,
  onDateClick: PropTypes.func,
  onAddClick: PropTypes.func,
  onDayClick: PropTypes.func,
  getCellHeight: PropTypes.func
};

export default MonthDay;