import React from 'react';
import {TODAY} from '../../../constants/calendar.js';

import DragAndDrop from '../../../hoc/dragndrop.jsx';

class WeekDay extends React.Component {
  constructor(props) {
    super(props);
  }

  renderDay() {
    const {date, events, id} = this.props;
    const nextDay = new Date(1970, 0, 2);
    const halfHours = [];
    let currentTime = new Date(1970, 0, 1, 0);
    let nextTime = new Date(1970, 0, 1, currentTime.getHours() + 1);
    let groups = [];

    const eventsWithTime = events.filter(event => {
      return event.timeBegin && event.timeEnd;
    }).sort((a, b) => {
      return a.timeBegin - b.timeBegin || b.timeEnd - a.timeEnd;
    }).reduce((res, event, ndx, arr) => {
      event = Object.assign({}, event);
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

    while(currentTime - nextDay < 0) {

      const currentEvents = eventsWithTime.filter(event => {
        return event.timeBegin >= currentTime && event.timeBegin < nextTime;
      });

      const currentHour = currentTime.getHours() > 12 ? currentTime.getHours() - 12 : currentTime.getHours();

      halfHours.push(
        <li className='week__hour week-hour' key={`${currentTime.getHours()}${currentTime.getMinutes()}`}>
          <div
            className='week-hour__body'
            data-dd='true'
            data-time={`${currentTime.getMonth()+1} ${currentTime.getDate()} ${currentTime.getFullYear()} ${currentTime.getHours()}:00`}
            data-date={id}
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
    const { eventDragAndDrop } = this.props;
    return events.map(event => {
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

const options = {
  type: 'day'
};

export default DragAndDrop(WeekDay, options);