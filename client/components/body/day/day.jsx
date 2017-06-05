import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GeminiScrollbar from 'react-gemini-scrollbar';

import { selectEvent } from '../../../actions/selectedevent';

import {TODAY, MONTH_NAMES} from '../../../constants/calendar.js';
import dragAndDrop from '../../../hoc/dragndrop';

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
    }).reduce((res, event, ndx, arr) => {
      event = {...event};
      if (ndx === 0) {
        groups.push(event.timeEnd);
        event.horizontal = 0;
        res.push(event);
        return res;
      }

      const find = groups.find((groupTime, groupNdx, groupArr) => {
        if (event.timeBegin >= groupTime) {
          event.horizontal = groupNdx;
          if (groupNdx === 0) {
            const find = groupArr.find(val => {
              return event.timeBegin < val;
            });
            if (!find) {
              res.push(event);
              res.map(resEvent => {
                if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
                return resEvent;
              });
              groups = [event.timeEnd];
              return true;
            }
          }
          groupArr[groupNdx] = Math.max(groupArr[groupNdx], event.timeEnd);
          res.push(event);
          if (ndx === arr.length - 1) {
            res.map(resEvent => {
              if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
              return resEvent;
            });
          }
          return true;
        }
        if (groupNdx === groupArr.length - 1) {
          event.horizontal = groupNdx + 1;
          groupArr.push(event.timeEnd);
          res.push(event);
          if (ndx === arr.length - 1) {
            res.map(resEvent => {
              if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
              return resEvent;
            });
          }
          return true;
        }
      });

      return res;
    }, []);
  }

  renderHalfHours() {
    const eventsWithTime = this.modifiedTimeEvents();
    const halfHours = [];
    const nextDay = new Date(1970, 0, 2);
    let currentTime = new Date(1970, 0, 1, 0);
    let nextTime = new Date(1970, 0, 1, currentTime.getHours() + 1);

    while(currentTime - nextDay < 0) {

      const currentEvents = eventsWithTime.filter(event => {
        return event.timeBegin >= currentTime && event.timeBegin < nextTime;
      });

      const currentHour = currentTime.getHours() > 12 ? currentTime.getHours() - 12 : currentTime.getHours();

      halfHours.push(
        <li className='day__hour hour' key={`${currentTime.getHours()}${currentTime.getMinutes()}`}>
          <div className='hour__time'>
            {`${currentTime.getHours() ? currentHour : 12}${currentTime.getHours() <= 12 ? 'AM' : 'PM'}`}
          </div>
          <div 
            className='hour__body'
            data-dd='true'
            data-time={`${currentTime.getMonth()+1} ${currentTime.getDate()} ${currentTime.getFullYear()} ${currentTime.getHours()}:00`}
          >
            {currentEvents ? this.getCurrentEvents(currentEvents) : ''}
          </div>
        </li>
      );

      currentTime = nextTime;
      nextTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours() + 1);
    }
    return halfHours;
  }

  getCurrentEvents(events) {
    return events.map(event => {
      const { eventDragAndDrop } = this.props;
      const timeDifference = event.timeEnd - event.timeBegin;
      const height = (timeDifference / 1000 / 60 / 60) * 100;
      const top = event.timeBegin.getMinutes() /60 * 100;
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
          <span className='day__num'>{`${space.getDate()} ${MONTH_NAMES[space.getMonth()]} ${space.getFullYear()}`}</span>
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

const dndOptions = {
};

const mapStateToProps = state => ({
  date: state.date,
  space: state.space.main,
  selectedEvent: state.selected
});

const mapDispatchToProps = dispatch => bindActionCreators({
  selectEvent
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(dragAndDrop(Day, dndOptions));