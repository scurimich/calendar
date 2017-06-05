import React from 'react';
import { DAYS_IN_WEEK, DAY, WEEKS_COUNT } from '../../../constants/calendar';
import { getWeekEvents } from '../../../utils';

export default class MonthEvents extends React.Component {
  constructor(props) {
    super(props);
  }

  renderEvents() {
    const { events, date } = this.props;
    if (events.length) {
      const lines = getWeekEvents(events, date);

      return lines.map((line, ndx) => {
        return <li key={ndx} className='week-events__line'>
          {
            line.map((item, ndx) => {
              if (!item._id) {
                return <span className={`week-events__offset week-events__offset_${item.size}`} key={ndx}></span>
              }
              return (
                <span
                  className={this.eventClasses(item)} 
                  key={ndx} 
                  id={item._id}
                >
                  {item.title}
                </span>
              );
            })
          }
        </li>
      });
    }
  }

  eventClasses(item) {
    return `week-events__item
      week-events__item_size-${item.size}
      ${item.hidden ? 'week-events__item_hidden' : ''}`;
  }

  render() {
    return (
      <ul className='month__week-events week-events'>
        {this.renderEvents()}
      </ul>
    );
  }
}