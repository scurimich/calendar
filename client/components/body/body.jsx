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

	eventsFilter() {
		const { events, space } = this.props;
		const day = !space.day() ? 6 : space.day() - 1;
		const next = space.clone().add(1, 'days');
		const prevDays = this.monthInfo.previous.extraDays;
		const nextDays = DAYS_IN_MONTH_SPACE - (this.monthInfo.current.days + prevDays);
		const monthBegin = space.clone().date(1 - prevDays);
		const monthEnd = space.clone().add(1, 'months').date(1 + nextDays);
		const weekBegin = space.clone().subtract(day, 'days');
		const weekEnd = space.clone().add(7 - day, 'days');

		return {
			year: events.filter(event => {
				return (event.dateBegin.year() == space.year()
					|| event.dateEnd.year() == space.year());
			}),
			month: events.filter(event => {
				return (event.dateBegin.isSameOrAfter(monthBegin) && event.dateBegin.isBefore(monthEnd))
					|| (event.dateEnd.isSameOrAfter(monthBegin) && event.dateEnd.isBefore(monthEnd));
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
		const spaceDate = space.clone();
		this.monthInfo = getMonthInfo(spaceDate);
		const events = this.eventsFilter();
		switch(active) {
			case 'Day': return <Day />;
			case 'Week': return <Week />;
			case 'Year': return <Year />;
			default: return <Month space={space}/>;
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
	space: state.space.main,
	selectedEvent: state.selected
});

const mapDispatchToProps = dispatch => bindActionCreators({
	eventWindowShow,
	eventWindowHide,
	groupWindowShow,
	groupWindowHide
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Body);