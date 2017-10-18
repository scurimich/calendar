import React from 'react';
import PropTypes from 'prop-types';

import MonthDay from './monthday.jsx';
import MonthEvents from './monthevents.jsx';
import DragAndDrop from '../../../hoc/dragndrop.jsx';
import { DAYS_IN_WEEK, TODAY } from '../../../constants/calendar.js';

import './monthweek.scss';

class MonthWeek extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    this.onDateClick = this.onDateClick.bind(this);
    this.getCellHeight = this.getCellHeight.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
  }

  changeSelectedDate(date, e) {
    this.setState({ selected: date });
  }

  onAddClick(date, e) {
    e.stopPropagation();
    const { eventWindowShow } = this.props;
    const data = {
      _id: null,
      allDay: true,
      title: '',
      description: '',
      dateBegin: date,
      dateEnd: date,
      timeBegin: null,
      timeEnd: null,
      periodic: false,
      week: [],
      group: null,
      notification: true
    };
    eventWindowShow(data);
  }

  onDayClick(date) {
    const {setDate} = this.props;
    setDate(date);
  }

  onDateClick(date, e) {
    e.stopPropagation();
    const { setView, setSpace, setMiniSpace } = this.props;
    setView('Day');
    setSpace(date);
    setMiniSpace(date);
  }

  getCellHeight(cell) {
    if (!cell) return;
    const { changeViewInfo } = this.props;
    const LINE_HEIGHT = 21;
    const height = cell.clientHeight - LINE_HEIGHT;
    changeViewInfo({ cellSize: Math.floor(height / LINE_HEIGHT) });
  }

  render() {
    const {
      activeDate,
      firstDay,
      events,
      weekNdx,
      viewInfo,
      eventDragAndDrop,
      selectedEvent,
      getWeek
    } = this.props;
    const { selected } = this.state;
    const { onDateClick, onAddClick, onDayClick, getCellHeight, changeSelectedDate } = this;
    const week = getWeek({space:firstDay, date: activeDate, events});

    return (
      <li className='month__week'>
        <MonthEvents
          date={firstDay}
          events={events}
          linesCount={viewInfo.cellSize}
          ndx={weekNdx}
          changeSelectedDate={changeSelectedDate}
          eventDragAndDrop={eventDragAndDrop}
        />
         <ul className='month__days'>
          {
            week.map((day, ndx) => (
              <MonthDay 
                {...day}
                key={ndx}
                selected={selected && selected.isSame(day.date)}
                hover={selectedEvent && day.date.isSameOrAfter(selectedEvent.dateBegin) && selectedEvent.dateEnd.isAfter(day.date)}
                onDateClick={onDateClick}
                onAddClick={onAddClick.bind(this, day.date)}
                onDayClick={onDayClick.bind(this, day.date)}
                getCellHeight={getCellHeight}
                changeSelectedDate={changeSelectedDate}
                eventDragAndDrop={eventDragAndDrop}
              />
            ))
          }
        </ul>
      </li>
    );
  }
}

MonthWeek.propTypes = {
  activeDate: PropTypes.object,
  selectedEvent: PropTypes.object,
  firstDay: PropTypes.object,
  events: PropTypes.array,
  weekNdx: PropTypes.number,
  viewInfo: PropTypes.object,
  eventDragAndDrop: PropTypes.func,
  setView: PropTypes.func,
  setSpace: PropTypes.func,
  setMiniSpace: PropTypes.func,
  eventWindowShow: PropTypes.func,
  setDate: PropTypes.func,
  changeViewInfo: PropTypes.func,
  getWeek: PropTypes.func
};

export default DragAndDrop(MonthWeek);