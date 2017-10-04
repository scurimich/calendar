import React from 'react';
import moment from 'moment';

import {TODAY} from '../../../constants/calendar.js';

import DragAndDrop from '../../../hoc/dragndrop.jsx';

class WeekDay extends React.Component {
  constructor(props) {
    super(props);
  }

  renderDay() {
    const {date, events, id} = this.props;
    const nextDay = moment(0, 'HH').add(1, 'days');
    const halfHours = [];
    let currentTime = moment(0, 'HH');
    let nextTime = currentTime.clone().add(1, 'hours');
    let groups = [];

    const eventsWithTime = events.filter(event => {
      return event.timeBegin && event.timeEnd;
    }).sort((a, b) => {
      return a.timeBegin - b.timeBegin || b.timeEnd - a.timeEnd;
    }).reduce((result, event, ndx, arr) => {
      event = Object.assign({}, event);
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

    while(currentTime.isBefore(nextDay)) {
      const currentEvents = eventsWithTime.filter(event => {
        return event.timeBegin.isSameOrAfter(currentTime) && event.timeBegin.isBefore(nextTime);
      });

      halfHours.push(
        <li className='week__hour week-hour' key={currentTime.format('HHmm')}>
          <div
            className='week-hour__body'
            data-dd='true'
            data-time={currentTime.format('MM DD YYYYY HH:00))')}
            data-date={id}
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
    const { eventDragAndDrop } = this.props;
    return events.map(event => {
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
        <div
        className='hour__event'
        key={event._id} id={event._id}
        style={ {'height': height + '%','width': width + '%', 'top': top + '%', 'left': left + '%', 'zIndex': zIndex} } 
        onMouseDown={eventDragAndDrop}
        >
          {event.title}
        </div>
      );
    });
  }

  render() {
    return (
      <li id='day' data-date={this.props.id} className={'week__day'}>
        <ul className='week__sublist'>
          {this.renderDay()}
        </ul>
      </li>
    );
  }
  
}
export default DragAndDrop(WeekDay);