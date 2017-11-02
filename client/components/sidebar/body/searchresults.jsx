import React from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';

import Event from './event.jsx';

import './searchresults.scss';

export default class SearchResults extends React.Component {
	onSrchResClick(date) {
		return this.props.onSrchResClick.bind(null, date);
	}

	getSearchString() {
		const { search } = this.props;
		if (search) return `Results for "${search}":`;
		return 'Search string is empty.';
	}

	getGroup(id) {
		const { groups } = this.props;
		return groups.find(group => id === group._id);
	}

	render() {
		const { events, eventWindowShow } = this.props;
		const searchString = this.getSearchString();

		return (
			<div className='sidebar__search-results search-results'>
				<h2 className='search-results__head'>{searchString}</h2>
				<div className='search-results__scroll-container'>
					<GeminiScrollbar className='search-results__scrollbar'>
					<ul className='search-results__list'>
						{
							events.map((event, key) => (
								<Event
									{...event}
									group={this.getGroup(event.group)}
									onEventClick={eventWindowShow.bind(null, {...event})}
									key={key}
								/>
							))
						}
					</ul>
					</GeminiScrollbar>
				</div>
			</div>
		);
	}
}