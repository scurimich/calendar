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

    return getWeekLines({data: events, date, linesCount}) || {lines: [], extra: []};
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
              <li key={ndx} className='month-events__line'>
              {
                line.map((item, ndx) => {
                  const color = item.group && item.group.color;
                  const offset = <div className={`month-events__offset month-events__offset_${item.size}`} key={ndx}></div>;
                  const event = (
                    <span
                      className={
                        `month-events__item
                        month-events__item_size-${item.size}
                        ${item.hidden ? 'month-events__item_hidden' : ''}
                        month-event`
                      }
                      key={ndx}
                      id={item._id}
                      ref={(line) => {this.line = line;}}
                      onMouseDown={eventDragAndDrop}
                    >
                      <div className='month-event__background' style={ color ? {'backgroundColor': color} : {} }></div>
                      <span className='month-event__title'>{item.title}</span>
                    </span>
                  );

                  return !item._id ? offset : event;
                })
              }
              </li>
            );
          })
        }
        <li className='month-events__line month-events__line_more'>
          {
            extra.map((item, ndx) => {
              const  offset = <div className={'month-events__offset month-events__offset_1'} key={ndx}></div>;
              const more = (
                <div className={'month-events__more'} key={ndx}>
                  <span className={'month-events__more-button'} onClick={this.moreClick.bind(this, item.date)}>{`+ ${item.count} more`}</span>
                </div>
              );

              return item.count === 0 ? offset : more;
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