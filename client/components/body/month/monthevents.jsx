import React from 'react';
import PropTypes from 'prop-types';

import './monthevents.scss';

export default class MonthEvents extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { getLineHeight } = this.props;
    if (this.line) getLineHeight(this.line);
  }

  getEvents() {
    const { events, date, linesCount, getWeekLines } = this.props;
    if (events.length) {
      return getWeekLines({data: events, date, linesCount});
    }
    return {
      lines: [],
      extra: []
    }
  }

  moreClick(date, e) {
    const { changeSelectedDate } = this.props;
    changeSelectedDate(date);
  }

  render() {
    const currentEvents = this.getEvents();
    const { lines, extra } = currentEvents;
    const { eventDragAndDrop } = this.props;
    return (
      <ul className='month__events month-events'>
        {
          lines.map((line, ndx) => {
            return (
              <li key={ndx} className='month-events__line' onMouseDown={eventDragAndDrop} ref={(line) => {this.line = line;}}>
              {
                line.map((item, ndx) => {
                  return !item._id ?
                    <div className={`month-events__offset month-events__offset_${item.size}`} key={ndx}></div> :
                    <span
                      className={`month-events__item month-events__item_size-${item.size}${item.hidden ? 'month-events__item_hidden' : ''}`}
                      key={ndx}
                      id={item._id}
                    >
                      {item.title}
                    </span>
                })
              }
              </li>
            );
          })
        }
        <li className='month-events__line'>
          {
            extra.map((item, ndx) => {
              return item.count === 0 ?
                <div className={'month-events__offset month-events__offset_1'} key={ndx}></div> :
                <div className={'month-events__more'} key={ndx}>
                  <span className={'month-events__more-button'} onClick={this.moreClick.bind(this, item.date)}>{`+ ${item.count} more`}</span>
                </div>
            })
          }
        </li>
      </ul>
    );
  }
}

MonthEvents.propTypes = {
  events: PropTypes.array,
  date: PropTypes.object,
  linesCount: PropTypes.number,
  changeSelectedDate: PropTypes.func,
  eventDragAndDrop: PropTypes.func,
  getLineHeight: PropTypes.func
};