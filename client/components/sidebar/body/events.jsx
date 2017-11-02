import React from 'react';
import PropTypes from 'prop-types';
import GeminiScrollbar from 'react-gemini-scrollbar';

import events from '../../../hoc/events.jsx';

import Event from './event.jsx';

import './events.scss';

class Events extends React.Component {
  getGroup(id, event) {
    const { groups } = this.props;
    return groups.find(group => group._id === id);
  }

	render() {
    const { date, events, eventsStatus, groups, currentGroup, eventWindowShow, sortDateDuration } = this.props;
    if (events.length) events.sort(sortDateDuration);

    const filteredEvents = events.filter(event => event.dateBegin.isSameOrBefore(date)
      && event.dateEnd.isSameOrAfter(date)
      && (!event.periodic || event.week[date.day() ? date.day() - 1 : 6])
      && (!currentGroup || currentGroup._id === event.group));
    const spinner = (
      <div className='events__spinner-container'>
        <span className='events__spinner'></span>
        <span className='events__loading'>loading</span>
      </div>
    );
    const empty = <span className='events__empty'>There are no events, add one.</span>;
    const content = (
      <GeminiScrollbar className='events__scrollbar'>
        <ul className='events__list'>
          {
            filteredEvents.map((event, key) => (
              <Event
                {...event}
                group={this.getGroup(event.group, event)}
                key={key}
                onEventClick={eventWindowShow.bind(null, {
                  ...event,
                  dateBegin: event.dateBegin.format('YYYY-MM-DD'),
                  dateEnd: event.dateEnd.format('YYYY-MM-DD'),
                })}
              />
            ))
          }
        </ul>
      </GeminiScrollbar>
    );

		return (
			<div className='events'>
        <h3 className='events__date'>{`${date.format('dddd D/MM/YYYY')}`}</h3>
        <div className='events__scroll-container'>
  				{eventsStatus.status === 'fetching' ? spinner : events.length ? content : empty}
        </div>
			</div>
		);
	}
}

Events.propTypes = {
  date: PropTypes.object,
  events: PropTypes.array,
  eventsStatus: PropTypes.object,
  groups: PropTypes.array,
  currentGroup: PropTypes.object,
  eventWindowShow: PropTypes.func,
  sortDateDuration: PropTypes.func
};

export default events(Events);