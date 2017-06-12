import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MonthWeek from './monthweek';
import { WEEKDAYS, WEEKS_COUNT, DAYS_IN_WEEK} from '../../../constants/calendar.js';

import { eventWindowShow } from '../../../actions/eventwindow';
import {
	setDate,
	setSpace,
	setMiniSpace
} from '../../../actions/space';
import { setView } from '../../../actions/view';

import './month.scss';

export default class Month extends React.Component {
	constructor(props) {
		super(props);
	}

	getMonth() {
		const { space, monthInfo } = this.props;
		let firstDay = new Date(monthInfo.current.year, monthInfo.current.number, 1 - (monthInfo.previous.extraDays));
		const monthArray = [];

		for (let i = 0; i < WEEKS_COUNT; i++, firstDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + DAYS_IN_WEEK)) {
			monthArray.push(firstDay);
		}
		return monthArray;
	}

	weekEvents(weekBegin) {
		const { events } = this.props;
		const weekEnd = new Date(weekBegin.getFullYear(), weekBegin.getMonth(), weekBegin.getDate() + 7);
		return events.filter(event => {
			if ((event.dateBegin >= weekBegin && event.dateBegin < weekEnd)
					|| (event.dateEnd > weekBegin && event.dateEnd < weekEnd)
					|| (event.dateBegin < weekBegin && event.dateEnd > weekEnd))
				return event;
		});
	}

	getSelectedEventDates() {
		const { selectedEvent } = this.props;
		if(selectedEvent && selectedEvent.newDateBegin) {
			const selected = selectedEvent;
			const begin = selected.newDateBegin;
			selected.newDateEnd = new Date(begin.getFullYear(), begin.getMonth(), begin.getDate() + selected.duration);
			return selected;
		}
	}

	render() {
		const {
			date,
			space,
			monthInfo,
			eventDragAndDrop,
			eventWindowShow,
			setDate,
			setView,
			setSpace,
			setMiniSpace
		} = this.props;
		return (
			<div className='month'>
				<header className='month__head weekdays'>
					<ul className='weekdays__list weekdays__list_month'>
						{WEEKDAYS.map((day, ndx) => (
							<li className='weekdays__item weekdays__item_month' key={ndx}>{day}</li>
						))}
					</ul>
				</header>
				<div className='month__main'>
					<ul className='month__list'>
						{
							this.getMonth().map((firstDay, ndx) => {
								return <MonthWeek
									activeDate={date}
									firstDay={firstDay} 
									events={this.weekEvents(firstDay)} 
									space={space} 
									prevDays={monthInfo.previous.extraDays} 
									curNumber={monthInfo.current.days} 
									key={ndx} 
									weekNdx={ndx}
									selectedEvent={this.getSelectedEventDates()}
									setDate={setDate}
									setSpace={setSpace}
									setMiniSpace={setMiniSpace}
									setView={setView}
									eventWindowShow={eventWindowShow}
									eventDragAndDrop={eventDragAndDrop}
								/>
							})
						}
					</ul>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	date: state.date,
	space: state.space.main,
	selectedEvent: state.selected
});

const mapDispatchToProps = dispatch => bindActionCreators({
	eventWindowShow,
	setDate,
	setSpace,
	setMiniSpace,
	setView
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Month);