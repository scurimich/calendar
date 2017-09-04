import React from 'react';
import { DAYS_IN_WEEK, DAY, WEEKS_COUNT } from '../../../constants/calendar.js';
import { getWeekEvents } from '../../../utils.js';

export default class MonthEvents extends React.Component {
  constructor(props) {
    super(props);
  }

  getEvents() {
    const { events, date, linesCount } = this.props;
    if (events.length) {
      return getWeekEvents(events, date, linesCount);
    }
    return {
      lines: [],
      extra: []
    }
  }

  eventClasses(item) {
    return `week-events__item
      week-events__item_size-${item.size}
      ${item.hidden ? 'week-events__item_hidden' : ''}`;
  }

  moreClick(date, e) {
    const { changeSelectedDate } = this.props;
    changeSelectedDate(date);
  }

  render() {
    const currentEvents = this.getEvents();
    const { lines, extra, changeSelectedDate } = currentEvents;
    return (
      <ul className='month__week-events week-events'>
        {
          lines.map((line, ndx) => {
            return (
              <li key={ndx} className='week-events__line'>
              {
                line.map((item, ndx) => {
                  return !item._id ?
                    <div className={`week-events__offset week-events__offset_${item.size}`} key={ndx}></div> :
                    <span className={this.eventClasses(item)} key={ndx} id={item._id}> {item.title} </span>
                })
              }
              </li>
            );
          })
        }
        <li className='week-events__line'>
          {
            extra.map((item, ndx) => {
              return item.count === 0 ?
                <div className={'week-events__offset week-events__offset_1'} key={ndx}></div> :
                <div className={'week-events__more'} key={ndx}>
                  <span className={'week-events__more-text'} onClick={this.moreClick.bind(this, item.date)}>{`+ ${item.count} more`}</span>
                </div>
            })
          }
        </li>
      </ul>
    );
  }
}