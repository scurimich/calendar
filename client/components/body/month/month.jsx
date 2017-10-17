import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import MonthWeek from './monthweek.jsx';
import { WEEKDAYS, WEEKS_COUNT, DAYS_IN_WEEK} from '../../../constants/calendar.js';

import { eventWindowShow } from '../../../actions/eventwindow.js';
import {
	setDate,
	setSpace,
	setMiniSpace
} from '../../../actions/space.js';
import { setView, changeViewInfo } from '../../../actions/view.js';

import './month.scss';

class Month extends React.Component {
	constructor(props) {
		super(props);
	}

	getMonth() {
		const { space, monthInfo } = this.props;
		let firstDay = moment([monthInfo.current.year, monthInfo.current.number]).date(1 - (monthInfo.previous.extraDays));
		const monthArray = [];

		for (let i = 0; i < WEEKS_COUNT; i++, firstDay = firstDay.clone().add(DAYS_IN_WEEK, 'days')) {
			monthArray.push(firstDay);
		}
		return monthArray;
	}

	weekEvents(weekBegin) {
		const { events } = this.props;
		const weekEnd = weekBegin.clone().add(7, 'days');
		return events.filter(event => {
			return ((event.dateBegin.isSameOrAfter(weekBegin) && event.dateBegin.isSameOrBefore(weekEnd))
				|| (event.dateEnd.isSameOrAfter(weekBegin) && event.dateEnd.isSameOrBefore(weekEnd))
				|| (event.dateBegin.isSameOrBefore(weekBegin) && event.dateEnd.isSameOrAfter(weekEnd)))
				&& event;
		});
	}

	render() {
		const {
			date,
			space,
			selectedEvent,
			monthInfo,
			viewInfo,
			eventWindowShow,
			setView,
			changeViewInfo,
			setDate,
			setSpace,
			setMiniSpace
		} = this.props;
		return (
			<div className='body__month month'>
				<ul className='month__weekdays'>
					{WEEKDAYS.map((day, ndx) => (
						<li className='month__weekday' key={ndx}>{day}</li>
					))}
				</ul>
				<ul className='month__weeks'>
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
								viewInfo={viewInfo}
								selectedEvent={selectedEvent}
								setDate={setDate}
								setSpace={setSpace}
								setMiniSpace={setMiniSpace}
								setView={setView}
								eventWindowShow={eventWindowShow}
								changeViewInfo={changeViewInfo}
							/>
						})
					}
				</ul>
			</div>
		);
	}
}

Month.propTypes = {
	events: PropTypes.array,
	date: PropTypes.object,
	space: PropTypes.object,
	selectedEvent: PropTypes.object,
	viewInfo: PropTypes.object,
	eventWindowShow: PropTypes.func,
	setDate: PropTypes.func,
	setSpace: PropTypes.func,
	setMiniSpace: PropTypes.func,
	setView: PropTypes.func,
	changeViewInfo: PropTypes.func
}

const mapStateToProps = state => ({
	date: state.date,
	space: state.space.main,
	selectedEvent: state.selected,
	viewInfo: state.viewInfo
});

const mapDispatchToProps = dispatch => bindActionCreators({
	eventWindowShow,
	setDate,
	setSpace,
	setMiniSpace,
	setView,
	changeViewInfo,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Month);