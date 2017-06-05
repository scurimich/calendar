import React from 'react';
import { addNull, sortEvents } from '../../../utils'
import { FULL_WEEKDAYS, TODAY } from '../../../constants/calendar';
import GeminiScrollbar from 'react-gemini-scrollbar';
import EventsDay from './eventsday.jsx';

import './Events.scss';

export default class Events extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { auth, fetchEvents, eventsStatus, fetchGroups, groupsStatus } = this.props;
		if (!eventsStatus.status) fetchEvents();
		if (!groupsStatus.status) fetchGroups();
	}

	getDates() {
		const { date, events } = this.props;
		events.sort(sortEvents);
		const dates = events.reduce((prev, cur, ndx) => {
			let begin = new Date(cur.dateBegin);
			const end = new Date(cur.dateEnd);

			if (end - begin === 0) {
				if (prev.length) {
					const finded = prev.find((val, ndx, arr) => (val.date - begin === 0 && arr[ndx].events.push(cur)));
					if (!finded) prev.push({ date: begin, events: [cur]})
				} else {
					prev.push({ date: begin, events: [cur] });
				}
			}

			while (begin <= end) {
				if (prev.length) {
					const finded = prev.find((val, ndx, arr) => (val.date - begin === 0 && arr[ndx].events.push(cur)));
					if (!finded) prev.push({ date: begin, events: [cur] });
				} else {
					prev.push({ date: begin, events: [cur] });
				}
				begin = new Date(begin.getFullYear(), begin.getMonth(), begin.getDate() + 1);
			}
			return prev;
		}, []);
		return dates;
	}

	renderContent() {
		const dates = this.getDates();
		const { eventsStatus } = this.props;
		if (eventsStatus.status === 'fetching') return <span className='spinner'></span>;
		if (!dates.length) return <span className='side-events__empty'>There are no events, add one'</span>;
		else return (
			<GeminiScrollbar>
				<ul className='side-events__days'>
					{
						dates.map((val, key) => <EventsDay {...val} key={key}/>)
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