import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GeminiScrollbar from 'react-gemini-scrollbar';
import moment from 'moment';

import calendarInfo from '../../../hoc/calendarinfo.jsx';
import dragAndDrop from '../../../hoc/dragndrop.jsx';

import './day.scss';

class Day extends React.Component {
  constructor(props) {
    super(props);
  }

  getAllDayEvents() {
    const { events, groups } = this.props;
    return events.filter(event => event.allDay).map(event => {
      const group = groups.find(group => group._id === event.group);
      return {...event, group};
    });
  }

  getTimeEvents() {
    const { events } = this.props;
    return events.filter(event => event.timeBegin && event.timeEnd);
  }

  modifiedTimeEvents() {
    const { events } = this.props;
    const timeEvents = this.getTimeEvents();
    let groups = [];

    return timeEvents.sort((a, b) => a.timeBegin - b.timeBegin || b.timeEnd - a.timeEnd)
      .reduce((result, event, ndx, arr) => {
        event = {...event};
        if (ndx === 0) {
          groups.push(event.timeEnd);
          event.horizontal = 0;
          result.push(event);
          return result;
        }

        const find = groups.find((groupTime, groupNdx, groupArr) => {
          if (event.timeBegin.isSameOrAfter(groupTime)) {
            event.horizontal = groupNdx;
            if (groupNdx === 0) {
              const find = groupArr.find(val => {
                return event.timeBegin.isBefore(val);
              });
              if (!find) {
                result.push(event);
                result.map(resEvent => {
                  if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
                  return resEvent;
                });
                groups = [event.timeEnd];
                return true;
              }
            }
            groupArr[groupNdx] = Math.max(groupArr[groupNdx], event.timeEnd);
            result.push(event);
            if (ndx === arr.length - 1) {
              result.map(resEvent => {
                if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
                return resEvent;
              });
            }
            return true;
          }
          if (groupNdx === groupArr.length - 1) {
            event.horizontal = groupNdx + 1;
            groupArr.push(event.timeEnd);
            result.push(event);
            if (ndx === arr.length - 1) {
              result.map(resEvent => {
                if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
                return resEvent;
              });
            }
            return true;
          }
        });

        return result;
      }, []);
  }

  getCurrentEvents(events) {
    return events.map(event => {
      const { eventDragAndDrop } = this.props;
      const timeDifference = event.timeEnd - event.timeBegin;
      const height = (timeDifference / 1000 / 60 / 60) * 100;
      const top = event.timeBegin.minutes() /60 * 100;
      const position = event.horizontal;
      const horizontalSize = event.horizontalSize;
      const onePiece = 100 / horizontalSize;
      const width = position !== horizontalSize - 1 ? onePiece * 1.5 : onePiece;
      const left = onePiece * position;
      const zIndex = position + 1;
      const color = event.group && event.group.color;
      return (
        <div
          className='day-hour__event hour-event'
          key={event._id}
          id={event._id}
          style={ {'height': height + '%','width': width + '%', 'top': top + '%', 'left': left + '%', 'zIndex': zIndex} }
          onMouseDown={eventDragAndDrop}
        >
          <div
            className='hour-event__background'
            style={ color ? {'backgroundColor': color} : {} }
          ></div>
          <span className='hour-event__title'>{event.title}</span>
          <span className='hour-event__description'>{event.description}</span>
          <span className='hour-event__time'>
            {`${event.timeBegin.format('HH:mm')} - ${event.timeEnd.format('HH:mm')}`}
          </span>
        </div>
      );
    });
  }

  render() {
    const { id, space, getHours } = this.props;
    const events = this.modifiedTimeEvents();
    const hours = getHours(events);

    return (
      <div className='body__day day' id='day' data-date={id}>
          <div className='day__scroll-container'>
            <GeminiScrollbar className='day__scrollbar'>
              <ul className='day__events day-events'>
                {
                  this.getAllDayEvents().map(event => {
                    const color = event.group && event.group.color;
                    const groupName = event.group ? event.group.label : '';
                    return (
                      <li className='day-events__event' key={event._id}>
                        <div className='day-events__background' style={ color ? {'backgroundColor': color} : {} }></div>
                        <span className='day-events__title'>{event.title}</span>
                        <p className='day-events__description'>{event.description}</p>
                      </li>
                    );
                  })
                }
              </ul>
              <ul className='day__list'>
                {
                  hours.map(hour => (
                    <li
                      className='day__hour day-hour'
                      key={hour.time.format('HHmm')}
                      data-key={hour.time.format('HHmm')}
                    >
                      <div className='day-hour__time'>
                        {hour.time.format('h:00 A')}
                      </div>
                      <div 
                        className='day-hour__body'
                        data-dd='true'
                        data-time={hour.time.format('MM DD YYYYY HH:mm')}
                      >
                        {hour.events ? this.getCurrentEvents(hour.events) : ''}
                      </div>
                    </li>
                  ))
                }
              </ul>
            </GeminiScrollbar>
          </div>
      </div>
    );
  }
}

Day.propTypes = {
  date: PropTypes.object,
  space: PropTypes.object,
  selectedEvent: PropTypes.object,
  events: PropTypes.array,
  eventDragAndDrop: PropTypes.func,
  getHours: PropTypes.func
};

const mapStateToProps = state => ({
  date: state.date,
  space: state.space.main,
  groups: state.groups
});

export default connect(mapStateToProps, null)(calendarInfo(dragAndDrop(Day)));