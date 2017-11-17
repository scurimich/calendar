import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { eventWindowShow } from '../../../actions/eventwindow.js';
import { setDate, setSpace, setMiniSpace } from '../../../actions/space.js';
import { setView, changeMonthView } from '../../../actions/view.js';

import dragAndDrop from '../../../hoc/dragndrop.jsx';
import events from '../../../hoc/events.jsx';

import MonthDay from './monthday.jsx';
import MonthEvents from './monthevents.jsx';

import './monthweek.scss';

class MonthWeek extends React.Component {
  constructor(props) {
    super(props);

    this.onDateClick = this.onDateClick.bind(this);
    this.getLinesNumber = this.getLinesNumber.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
    this.getEventsGroups = this.getEventsGroups.bind(this);
  }

  componentDidUpdate() {
    const { changeMonthView, monthView }  = this.props;
    const cell = document.querySelector('.month-day__body');
    const line = document.querySelector('.month-events__line:not([class*=more])');

    if (cell && cell.clientHeight && cell.clientHeight !== monthView.cellSize) 
      changeMonthView({ cellSize: cell.clientHeight });
    if (line && line.clientHeight && line.clientHeight !== monthView.lineSize)
      changeMonthView({ lineSize: line.clientHeight });
  }

  changeSelectedDate(date, e) {
    const { changeMonthView } = this.props;
    changeMonthView({ allEvents: date });
  }

  onAddClick(date, e) {
    const { eventWindowShow } = this.props;
    e.stopPropagation();
    const data = {
      _id: null,
      allDay: true,
      title: '',
      description: '',
      dateBegin: date.format('YYYY-MM-DD'),
      dateEnd: date.format('YYYY-MM-DD'),
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
    const { setDate } = this.props;
    setDate(date);
  }

  onDateClick(date, e) {
    const { setView, setSpace, setMiniSpace } = this.props;
    e.stopPropagation();
    setView('Day');
    setSpace(date);
    setMiniSpace(date);
  }

  getLinesNumber() {
    const { cellSize, lineSize } = this.props.monthView;
    return isFinite(Math.floor((cellSize - (lineSize - 1)) / lineSize)) && Math.floor((cellSize - lineSize) / lineSize);
  }

  getEventsGroups(events) {
    const {groups} = this.props;
    return events.map(event => {
      if (!event.group) return event;
      const group = groups.find(group => group._id === event.group);
      return {...event, group};
    });
  }

  render() {
    const {
      space,
      date,
      firstDay,
      events,
      groups,
      sidebar,
      weekNdx,
      eventDragAndDrop,
      selectedEvent,
      getWeek,
      getWeekLines,
      filterWeek
    } = this.props;
    const {
      onDateClick,
      onAddClick,
      onDayClick,
      getCellHeight,
      changeSelectedDate,
      getLineHeight,
      getLinesNumber,
      getEventsGroups
     } = this;
    const { allEvents, cellSize } = this.props.monthView;
    const filteredEvents = filterWeek({weekBegin: firstDay, events});
    const week = getWeek({space:firstDay, globalSpace: space, events: filteredEvents, date});

    return (
      <li className='month__week'>
        <MonthEvents
          date={firstDay}
          events={getEventsGroups(filteredEvents)}
          linesCount={getLinesNumber() || 1}
          sidebar={sidebar}
          ndx={weekNdx}
          changeSelectedDate={changeSelectedDate}
          eventDragAndDrop={eventDragAndDrop}
          getWeekLines={getWeekLines}
        />
         <ul className='month__days'>
          {
            week.map((day, ndx) => (
              <MonthDay 
                {...day}
                events={getEventsGroups(day.events)}
                key={ndx}
                selected={allEvents && allEvents.isSame(day.date)}
                hover={
                  selectedEvent
                  && selectedEvent.dateBegin.isSameOrBefore(day.date)
                  && selectedEvent.dateEnd.isSameOrAfter(day.date)
                }
                onDateClick={onDateClick}
                onAddClick={onAddClick.bind(this, day.date)}
                onDayClick={onDayClick.bind(this, day.date)}
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
  date: PropTypes.object,
  space: PropTypes.object,
  selectedEvent: PropTypes.object,
  firstDay: PropTypes.object,
  events: PropTypes.array,
  groups: PropTypes.array,
  weekNdx: PropTypes.number,
  monthView: PropTypes.object,
  sidebar: PropTypes.bool,
  eventDragAndDrop: PropTypes.func,
  setView: PropTypes.func,
  setSpace: PropTypes.func,
  setMiniSpace: PropTypes.func,
  eventWindowShow: PropTypes.func,
  setDate: PropTypes.func,
  changeMonthView: PropTypes.func,
  getWeek: PropTypes.func,
  getWeekLines: PropTypes.func,
  filterWeek: PropTypes.func
};

const mapStateToProps = state => ({
  date: state.date,
  events: state.events,
  groups: state.groups,
  space: state.space.main,
  selectedEvent: state.selected,
  monthView: state.monthView,
  sidebar: state.sidebar
});

const mapDispatchToProps = dispatch => bindActionCreators({
  eventWindowShow,
  setDate,
  setSpace,
  setMiniSpace,
  setView,
  changeMonthView,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(events(dragAndDrop(MonthWeek)));