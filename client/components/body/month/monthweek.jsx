import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MonthDay from './monthday.jsx';
import MonthEvents from './monthevents.jsx';
import dragAndDrop from '../../../hoc/dragndrop.jsx';
import events from '../../../hoc/events.jsx';

import { eventWindowShow } from '../../../actions/eventwindow.js';
import {
  setDate,
  setSpace,
  setMiniSpace
} from '../../../actions/space.js';
import { setView, changeViewInfo } from '../../../actions/view.js';

import './monthweek.scss';

class MonthWeek extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    this.onDateClick = this.onDateClick.bind(this);
    this.getCellHeight = this.getCellHeight.bind(this);
    this.getLineHeight = this.getLineHeight.bind(this);
    this.getLinesNumber = this.getLinesNumber.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
    this.getEventsGroups = this.getEventsGroups.bind(this);
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
    e.stopPropagation();
    const { setView, setSpace, setMiniSpace } = this.props;
    setView('Day');
    setSpace(date);
    setMiniSpace(date);
  }

  getCellHeight(cell) {
    if (!cell) return;
    const { changeViewInfo, viewInfo } = this.props;
    if (viewInfo.cellSize !== cell.clientHeight)
      changeViewInfo({ cellSize: cell.clientHeight });
  }

  getLineHeight(line) {
    if (!line) return;
    const { changeViewInfo, viewInfo } = this.props;
    if (viewInfo.lineSize !== line.clientHeight)
      changeViewInfo({ lineSize: line.clientHeight });
  }

  getLinesNumber() {
    const { cellSize, lineSize } = this.props.viewInfo;
    return isFinite(Math.floor((cellSize - lineSize) / lineSize)) && Math.floor((cellSize - lineSize) / lineSize);
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
      weekNdx,
      eventDragAndDrop,
      selectedEvent,
      getWeek,
      getWeekLines,
      filterWeek
    } = this.props;
    const { selected } = this.state;
    const { onDateClick, onAddClick, onDayClick, getCellHeight, changeSelectedDate, getLineHeight, getLinesNumber, getEventsGroups } = this;
    const filteredEvents = filterWeek({weekBegin: firstDay, events});
    const week = getWeek({space:firstDay, globalSpace: space, events: filteredEvents, date});
    console.log(selectedEvent)
    return (
      <li className='month__week'>
        <MonthEvents
          date={firstDay}
          events={getEventsGroups(filteredEvents)}
          linesCount={getLinesNumber() || 0}
          ndx={weekNdx}
          changeSelectedDate={changeSelectedDate}
          eventDragAndDrop={eventDragAndDrop}
          getWeekLines={getWeekLines}
          getLineHeight={getLineHeight}
        />
         <ul className='month__days'>
          {
            week.map((day, ndx) => (
              <MonthDay 
                {...day}
                events={getEventsGroups(day.events)}
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
  date: PropTypes.object,
  space: PropTypes.object,
  selectedEvent: PropTypes.object,
  firstDay: PropTypes.object,
  events: PropTypes.array,
  groups: PropTypes.array,
  weekNdx: PropTypes.number,
  viewInfo: PropTypes.object,
  eventDragAndDrop: PropTypes.func,
  setView: PropTypes.func,
  setSpace: PropTypes.func,
  setMiniSpace: PropTypes.func,
  eventWindowShow: PropTypes.func,
  setDate: PropTypes.func,
  changeViewInfo: PropTypes.func,
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
  viewInfo: state.viewInfo
});

const mapDispatchToProps = dispatch => bindActionCreators({
  eventWindowShow,
  setDate,
  setSpace,
  setMiniSpace,
  setView,
  changeViewInfo,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(events(dragAndDrop(MonthWeek)));