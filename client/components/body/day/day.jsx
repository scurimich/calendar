import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GeminiScrollbar from 'react-gemini-scrollbar';
import moment from 'moment';

import { selectEvent } from '../../../actions/selectedevent.js';

import dragAndDrop from '../../../hoc/dragndrop.jsx';

import './day.scss';

class Day extends React.Component {
  constructor(props) {
    super(props);
  }

  getAllDayEvents() {
    const { events } = this.props;
    return events.filter(event => {
      return event.allDay;
    });
  }

  getTimeEvents() {
    const { events } = this.props;
    return events.filter(event => {
      return event.timeBegin && event.timeEnd;
    });
  }

  modifiedTimeEvents() {
    const { events } = this.props;
    let groups = [];

    return this.getTimeEvents().sort((a, b) => {
      return a.timeBegin - b.timeBegin || b.timeEnd - a.timeEnd;
    }).reduce((result, event, ndx, arr) => {
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

  renderHalfHours() {
    const eventsWithTime = this.modifiedTimeEvents();
    const halfHours = [];
    const nextDay = moment(0, 'HH').add(1, 'days');
    let currentTime = moment(0, 'HH');
    let nextTime = currentTime.clone().add(1, 'hours');

    while(currentTime.isBefore(nextDay)) {
      const currentEvents = eventsWithTime.filter(event => {
        return event.timeBegin.isSameOrAfter(currentTime) && event.timeBegin.isBefore(nextTime);
      });

      halfHours.push(
        <li className='day__hour hour' key={currentTime.format('HHmm')} data-key={currentTime.format('HHmm')}>
          <div className='hour__time'>
            {currentTime.format('h:00 A')}
          </div>
          <div 
            className='hour__body'
            data-dd='true'
            data-time={currentTime.format('MM DD YYYYY HH:mm')}
          >
            {currentEvents ? this.getCurrentEvents(currentEvents) : ''}
          </div>
        </li>
      );

      currentTime = nextTime.clone();
      nextTime.add(1, 'hours');
    }
    return halfHours;
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
      return (
        <div className='hour__event' key={event._id} id={event._id} style={ {'height': height + '%','width': width + '%', 'top': top + '%', 'left': left + '%', 'zIndex': zIndex} } onMouseDown={eventDragAndDrop}>
          {event.title}
        </div>
      );
    });
  }

  render() {
    const { id, space } = this.props;
    return (
      <div className='day' id='day' data-date={id}>
        <div className='day__head'>
          <span className='day__num'>{space.format('DD MMM YYYY')}</span>
        </div>
          <div className='day__main'>
            <GeminiScrollbar>
              <ul className='allday'>
                {
                  this.getAllDayEvents().map(event => {
                    return (
                      <li className='allday__event' key={event._id}>
                        { event.title }
                      </li>
                    );
                  })
                }
              </ul>
              <ul className='day__list'>
                {this.renderHalfHours()}
              </ul>
            </GeminiScrollbar>
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  date: state.date,
  space: state.space.main,
  selectedEvent: state.selected
});

export default connect(mapStateToProps, null)(dragAndDrop(Day));