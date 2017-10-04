import React from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';

import Event from './event.jsx';

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