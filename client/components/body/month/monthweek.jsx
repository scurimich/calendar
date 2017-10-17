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
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
  }

  changeSelectedDate(date, e) {
    this.setState({ selected: date });
  }

  getWeek() {
    const { firstDay, activeDate, space, selectedEvent, events } = this.props;
    const week = [];
    const year = firstDay.year();
    const month = firstDay.month();
    const day = firstDay.day() == 0 ? 6 : firstDay.day() - 1;
    let oneDay = day == 1 ? firstDay
      : firstDay.clone().subtract(day, 'days');

    for (let i = 1; i <= DAYS_IN_WEEK; oneDay = oneDay.clone().add(1, 'days'), i++) {
      const currentEvents = events.filter(event => (event.dateBegin <= oneDay && event.dateEnd >= oneDay));
      const currentMonth = oneDay.month() + 1;
      let currentDay = oneDay.format('YYYY,MM,DD');

      week.push({
        date: oneDay,
        selected: this.state.selected - oneDay === 0,
        events: currentEvents,
        id: currentDay,
        current: !Boolean(activeDate - oneDay),
        today: !Boolean(TODAY - oneDay),
        prevMonth: currentMonth < space.month() + 1,
        nextMonth: currentMonth > space.month() + 1,
        hover: selectedEvent ?
          Boolean(oneDay.isSameOrAfter(selectedEvent.dateBegin)
            && selectedEvent.dateEnd.isAfter(oneDay))
          : null,
        onDateClick: this.onDateClick.bind(this, oneDay),
        onAddClick: this.onAddClick.bind(this, oneDay),
        onDayClick: this.onDayClick.bind(this, oneDay),
        getCellHeight: this.getCellHeight.bind(this),
        changeSelectedDate: this.changeSelectedDate.bind(this)
      });
    }
    return week;
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
      firstDay,
      events,
      weekNdx,
      viewInfo,
      eventDragAndDrop
    } = this.props;
    return (
      <li className='month__week' onClick={this.onWeekClick}>
        <MonthEvents
          date={firstDay}
          events={events}
          linesCount={viewInfo.cellSize}
          ndx={weekNdx}
          changeSelectedDate={this.changeSelectedDate}
          eventDragAndDrop={eventDragAndDrop}
        />
        <ul className='month__days'>
          {
            this.getWeek().map((day, dayNdx) => {
              return (<MonthDay
                {...day}
                key={dayNdx}
                eventDragAndDrop={eventDragAndDrop}
              />);
            })
          }
        </ul>
      </li>
    );
  }
}

MonthWeek.propTypes = {
  activeDate: PropTypes.object,
  space: PropTypes.object,
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
  setDate: PropTypes.func
};

export default DragAndDrop(MonthWeek);