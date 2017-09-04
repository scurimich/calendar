import React from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';
import Event from './event.jsx';
import { addNull, sortEvents } from '../../../utils.js';
import { FULL_WEEKDAYS, TODAY } from '../../../constants/calendar.js';

import './Events.scss';

export default class Events extends React.Component {
	constructor(props) {
		super(props);
	}

  formatDate(date) {
    return `${date === TODAY ? 'Today' : FULL_WEEKDAYS[date.getDay()].toUpperCase()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  formatTime(event) {
  	if (!event.timeBegin) return;
  	const { timeBegin, timeEnd } = event;
  	const begin = `${addNull(timeBegin.getHours())}:${addNull(timeBegin.getMinutes())}`;
  	const end = `${addNull(timeEnd.getHours())}:${addNull(timeEnd.getMinutes())}`;
  	return `${begin} - ${end}`;
  }

	renderContent() {
		const { eventsStatus, date, events } = this.props;
		if (events) events.sort(sortEvents);

		if (eventsStatus.status === 'fetching') return <span className='spinner'></span>;

		if (!events.length) return <span className='side-events__empty'>There are no events, add one'</span>;
		else return (
			<GeminiScrollbar>
    		<h3 className='side-events__date'>{this.formatDate(date)}</h3>
    		<ul className='side-events__list'>
					{
						events.filter(event => event.dateBegin <= date && event.dateEnd >= date)
							.map((event, key) => <Event {...event} key={key} time={this.formatTime(event)} />)
					}
				</ul>
			</GeminiScrollbar>
		);
	}

	render() {
		return (
			<div className='side-events'>
				{this.renderContent()}
			</div>
		);
	}
}