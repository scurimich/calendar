import React from 'react';
import PropTypes from 'prop-types';

import WeekHourEvent from './weekhourevent.jsx';
import DragAndDrop from '../../../hoc/dragndrop.jsx';

import './weekday.scss';

class WeekDay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, events, getHours, weekend, eventDragAndDrop, setEventsPositions} = this.props;
    const hours = getHours(events);

    return (
      <li id='day' className={`week__day${weekend ? ' week__day_weekend' : ''}`}>
        <ul className='week__hours'>
          {
            hours.map(hour => {
              const events = setEventsPositions(hour.events);

              return (
                <li className='week__hour week-hour' key={hour.time.format('HHmm')}>
                  <div
                    className='week-hour__body'
                    data-dd='true'
                    data-time={hour.time.format('MM DD YYYYY HH:00))')}
                    data-date={id}
                  >
                    {
                      events.map((event, ndx) => {
                        <WeekHourEvent {...event} key={ndx} eventDragAndDrop={eventDragAndDrop} />
                      })
                    }
                  </div>
                </li>
              );
            })
          }
        </ul>
      </li>
    );
  }
}

WeekDay.propTypes = {
  events: PropTypes.array,
  id: PropTypes.string,
  eventDragAndDrop: PropTypes.func,
  setEventsPositions: PropTypes.func,
  getHours: PropTypes.func
};

export default DragAndDrop(WeekDay);