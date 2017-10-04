import React from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';
import Event from './event.jsx';
import { sortEvents } from '../../../utils.js';

import './Events.scss';

export default class Events extends React.Component {
	constructor(props) {
		super(props);
	}

  getGroup(id) {
    const { groups } = this.props;
    return groups.find(group => group._id === id);
  }

	renderContent() {
		const { eventsStatus, date, events, groups, eventWindowShow, currentGroup } = this.props;
		if (events) events.sort(sortEvents);

		if (eventsStatus.status === 'fetching') return <span className='spinner'></span>;

		if (!events.length) return <span className='side-events__empty'>There are no events, add one'</span>;
		else return (
      <ul className='side-events__list'>
        {
          events.filter(event => event.dateBegin.isSameOrBefore(date)
            && event.dateEnd.isSameOrAfter(date)
            && (!event.periodic || event.week[date.day() ? date.day() - 1 : 6])
            && (!currentGroup || currentGroup._id === event.group))
            .map((event, key) => <Event {...event} key={key} onCogClick={eventWindowShow.bind(null, {...event})} />)
        }
      </ul>
		);
	}

	render() {
    const { date } = this.props;
		return (
			<div className='side-events'>
        <GeminiScrollbar>
          <h3 className='side-events__date'>{`${date.format('dddd D/MM/YYYY')}`}</h3>
  				{this.renderContent()}
        </GeminiScrollbar>
			</div>
		);
	}
}