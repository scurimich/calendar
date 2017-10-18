import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import MonthWeek from './monthweek.jsx';
import { WEEKDAYS, NUMBER_OF_WEEKS, DAYS_IN_WEEK} from '../../../constants/calendar.js';
import calendarInfo from '../../../hoc/calendarinfo.jsx';

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
			viewInfo,
			eventWindowShow,
			setView,
			changeViewInfo,
			setDate,
			setSpace,
			setMiniSpace,
			getWeeks,
			getWeek
		} = this.props;
		const weeks = getWeeks(space);

		return (
			<div className='body__month month'>
				<ul className='month__weekdays'>
					{WEEKDAYS.map((day, ndx) => (
						<li className='month__weekday' key={ndx}>{day}</li>
					))}
				</ul>
				<ul className='month__weeks'>
					{
						weeks.map((firstDay, ndx) => {
							return <MonthWeek
								activeDate={date}
								firstDay={firstDay} 
								events={this.weekEvents(firstDay)} 
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
								getWeek={getWeek}
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

export default connect(mapStateToProps, mapDispatchToProps)(calendarInfo(Month));