import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Year from './year/year.jsx';
import Month from './month/month.jsx';
import Week from './week/week.jsx';
import Day from './day/day.jsx';
import EventWindow from './dialogs/eventwindow.jsx';
import GroupWindow from './dialogs/groupwindow.jsx';

import {
	addEvent,
	updateEvent,
	removeEvent
} from '../../actions/events.js';
import { eventWindowShow, eventWindowHide } from '../../actions/eventwindow.js';
import { groupWindowShow, groupWindowHide } from '../../actions/groupwindow.js';
import { addGroup, updateGroup } from '../../actions/groups.js';

import { DAYS_IN_MONTH_SPACE } from '../../constants/calendar';
import { getMonthInfo } from '../../utils';

import './body.scss';

class Body extends React.Component {

	eventsFilter(info) {
		const { events, space } = this.props;
		const date = space.main;
		const day = !date.day() ? 6 : date.day() - 1;
		const next = date.clone().add(1, 'days');
		const prevDays = this.monthInfo.previous.extraDays;
		const nextDays = DAYS_IN_MONTH_SPACE - (this.monthInfo.current.days + prevDays);
		const monthBegin = date.clone().date(1 - prevDays);
		const monthEnd = date.clone().add(1, 'months').date(1 + nextDays);
		const weekBegin = date.clone().subtract(day, 'days');
		const weekEnd = date.clone().add(7 - day, 'days');

		return {
			year: events.filter(event => {
				return (event.dateBegin.year() == info.current.year
					|| event.dateEnd.year() == info.current.year);
			}),
			month: events.filter(event => {
				return (event.dateBegin.isSameOrAfter(monthBegin) && event.dateBegin.isBefore(monthEnd))
					|| (event.dateEnd.isSameOrAfter(monthBegin) && event.dateEnd.isBefore(monthEnd));
			}),
			week: events.filter(event => {
				return (event.dateBegin.isSameOrAfter(weekBegin) && event.dateBegin.isBefore(weekEnd))
					|| (event.dateEnd.isSameOrAfter(weekBegin) && event.dateEnd.isBefore(weekEnd));
			}),
			day: events.filter(event => {
				return event.dateBegin.isSame(date)
					|| (event.dateBegin.isSameOrBefore(date) && event.dateEnd.isSameOrAfter(date))
					&& (event.periodic ? event.week[day] : true);
			})
		};
	}

	setCurrentView() {
		const {
			active,
			space,
			onAddClick,
			onMonthDayClick
		} = this.props;
		const spaceDate = space.main.clone();
		this.monthInfo = getMonthInfo(spaceDate);
		const events = this.eventsFilter(this.monthInfo);
		switch(active) {
			case 'Day': return <Day events={events.day} />;
			case 'Week': return <Week events={events.week} />;
			case 'Year': return <Year events={events.year} />;
			default: return <Month events={events.month} />;
		}
	}

	render() {
		const {
			eventWindow,
			eventWindowHide,
			eventWindowShow,
			groups,
			groupWindow,
			groupWindowShow,
			groupWindowHide
		} = this.props;
		return (
			<div className="content__body body">
				{this.setCurrentView()}
				<EventWindow
					addEvent={addEvent}
					updateEvent={updateEvent}
					eventWindow={eventWindow}
					onWindowClose={eventWindowHide}
					addGroup={groupWindowShow}
					groups={groups}
					eventWindowShow={eventWindowShow}
				/>
				<GroupWindow
					addGroup={addGroup}
					groupWindow={groupWindow}
					onWindowClose={groupWindowHide}
					updateGroup={updateGroup}
				/>
			</div>
		);
	}
}

Body.propTypes = {
	active: PropTypes.string,
	date: PropTypes.object,
	events: PropTypes.array,
	eventWindow: PropTypes.object,
	groups: PropTypes.array,
	groupWindow: PropTypes.object,
	space: PropTypes.object,
	selectedEvent: PropTypes.object,
	eventWindowShow: PropTypes.func,
	eventWindowHide: PropTypes.func,
	groupWindowShow: PropTypes.func,
	groupWindowHide: PropTypes.func
};

const mapStateToProps = state => ({
	active: state.view,
	date: state.date,
	events: state.events,
	eventWindow: state.eventWindow,
	groups: state.groups,
	groupWindow: state.groupWindow,
	space: state.space,
	selectedEvent: state.selected
});

const mapDispatchToProps = dispatch => bindActionCreators({
	eventWindowShow,
	eventWindowHide,
	groupWindowShow,
	groupWindowHide
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Body);