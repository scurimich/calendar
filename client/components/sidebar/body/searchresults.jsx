import React from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';

import Event from './event';
import { addNull } from '../../../utils';
import { MONTH_NAMES } from '../../../constants/calendar';

import './SearchResults.scss';

export default class SearchResults extends React.Component {
	constructor(props) {
		super(props)
	}

	onSrchResClick(date) {
		return this.props.onSrchResClick.bind(null, date);
	}

	getEvents() {
		const { events } = this.props;
	}

	getSearchString() {
		const { search } = this.props;
		if (search) return `Results for "${search}":`;
		return 'Search string is empty.';
	}

	getGroup(id) {
		const { groups } = this.props;
		return groups.find(group => (id === group.id));
	}

	getTime(begin, end) {
		if (!begin) return 'all day';
		const beginHours = begin.getHours();
		const beginMinutes = addNull(begin.getMinutes());
		const endHours = end.getHours();
		const endMinutes = addNull(end.getMinutes());
		return `${beginHours}:${beginMinutes} - ${endHours}:${endMinutes}`;
	}

	getDate(begin, end) {
		const beginDate = begin.getDate();
		const beginMonth = MONTH_NAMES[begin.getMonth()].substr(0, 3);
		const beginYear = begin.getFullYear();
		const endDate = end.getDate();
		const endMonth = MONTH_NAMES[begin.getMonth()].substr(0, 3);
		const endYear = end.getFullYear();
		return `${beginDate} ${beginMonth} ${beginYear} - ${endDate} ${endMonth} ${endYear}`;
	}

	render() {
		const { events, eventWindowShow } = this.props;
		return (
			<div className='search-res'>
				<h2 className='search-res__head'>{this.getSearchString()}</h2>
				<GeminiScrollbar>
				<ul className='search-res__list'>
					{
						events.map((event, key) => (
							<Event
								title={event.title}
								description={event.description}
								time={this.getTime(event.timeBegin, event.timeEnd)}
								date={this.getDate(event.dateBegin, event.dateEnd)}
								group={this.getGroup(event.group)}
								onEventClick={eventWindowShow.bind(null, event)}
								key={key}
							/>
						))
					}
				</ul>
				</GeminiScrollbar>
			</div>
		);
	}
}