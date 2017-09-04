import React from 'react';
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
	changeEvent,
	removeEvent
} from '../../actions/events.js';
import { eventWindowShow, eventWindowHide } from '../../actions/eventwindow.js';
import { groupWindowShow, groupWindowHide } from '../../actions/groupwindow.js';
import { addGroup } from '../../actions/groups.js';

import {
	WEEKDAYS,
	MONTH_NAMES,
	WEEKS_COUNT,
	DAYS_IN_WEEK,
	MONTH_IN_YEAR,
	TODAY,
	DAYS_IN_MONTH_SPACE,
	DAY
} from '../../constants/calendar';
import {getMonthInfo} from '../../utils';

import './body.scss';

class Body extends React.Component {
	constructor(props) {
		super(props);
	}

	eventsFilter(info) {
		const { events, space } = this.props;
		const date = space.main;
		const day = date.getDay() === 0 ? 6 : date.getDay() - 1;
		const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
		const prevDays = this.monthInfo.previous.extraDays;
		const nextDays = DAYS_IN_MONTH_SPACE - (this.monthInfo.current.days + prevDays);
		const monthBegin = new Date(date.getFullYear(), date.getMonth(), 1 - prevDays);
		const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1 + nextDays);
		const weekBegin = new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
		const weekEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() - day + 7);

		return {
			year: events.filter(val => {
				if (val.dateBegin.getFullYear() == info.current.year
					|| val.dateEnd.getFullYear() == info.current.year)
					return val;
			}),
			month: events.filter(val => {
				if ((val.dateBegin >= monthBegin && val.dateBegin < monthEnd)
					|| (val.dateEnd >= monthBegin && val.dateEnd < monthEnd))
					return val;
			}),
			week: events.filter(val => {
				if ((val.dateBegin >= weekBegin && val.dateBegin < weekEnd)
					|| (val.dateEnd >= weekBegin && val.dateEnd < weekEnd))
					return val;
			}),
			day: events.filter(val => {
				if (val.dateBegin - date === 0
					|| (val.dateBegin <= date && val.dateEnd > date) )
					return val;
			})
		};
	}


	setCurrentView() {
		const {
			active,
			date,
			space,
			onAddClick,
			onMonthDayClick
		} = this.props;
		const monthSpace = space.main;
		const spaceDate = new Date(monthSpace.getFullYear(), monthSpace.getMonth());
		this.monthInfo = getMonthInfo(spaceDate);
		const events = this.eventsFilter(this.monthInfo);
		switch(active) {
			case 'Day': return <Day events={events.day} />;
			case 'Week': return <Week events={events.week} monthInfo={this.monthInfo} />;
			case 'Year': return <Year events={events.year} />;
			default: return <Month events={events.month} monthInfo={this.monthInfo} />;
		}
	}

	
	render() {
		const {
			eventWindow,
			eventWindowHide,
			groups,
			groupWindow,
			groupWindowShow,
			groupWindowHide,
			addGroup
		} = this.props;
		return (
			<div className="body">
				{this.setCurrentView()}
				<EventWindow
					addEvent={addEvent}
					eventWindow={eventWindow}
					onWindowClose={eventWindowHide}
					addGroup={groupWindowShow}
					groups={groups}
				/>
				<GroupWindow
					sendData={addGroup}
					window={groupWindow}
					onWindowClose={groupWindowHide}
				/>
			</div>
		);
	}
}




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
	changeEvent,
	groupWindowShow,
	groupWindowHide,
	addGroup
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Body);