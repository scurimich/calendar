import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addEvent, updateEvent, removeEvent } from '../../actions/events.js';
import { eventWindowShow, eventWindowHide } from '../../actions/eventwindow.js';
import { groupWindowShow, groupWindowHide } from '../../actions/groupwindow.js';
import { addGroup, updateGroup } from '../../actions/groups.js';

import Year from './year/year.jsx';
import Month from './month/month.jsx';
import Week from './week/week.jsx';
import Day from './day/day.jsx';
import EventWindow from './dialogs/eventwindow.jsx';
import GroupWindow from './dialogs/groupwindow.jsx';

import './body.scss';

class Body extends React.Component {
	setCurrentView() {
		const { active, space } = this.props;

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
			groupWindowHide,
			removeEvent
		} = this.props;
		const view = this.setCurrentView();

		return (
			<div className="content__body body">
				{ view }
				<EventWindow
					addEvent={addEvent}
					updateEvent={updateEvent}
					removeEvent={removeEvent}
					eventWindow={eventWindow}
					eventWindowHide={eventWindowHide}
					addGroup={groupWindowShow}
					groups={groups}
					eventWindowShow={eventWindowShow}
				/>
				<GroupWindow
					addGroup={addGroup}
					groupWindow={groupWindow}
					groupWindowHide={groupWindowHide}
					updateGroup={updateGroup}
				/>
			</div>
		);
	}
}

Body.propTypes = {
	active: PropTypes.string,
	eventWindow: PropTypes.object,
	groups: PropTypes.array,
	groupWindow: PropTypes.object,
	space: PropTypes.object,
	eventWindowShow: PropTypes.func,
	eventWindowHide: PropTypes.func,
	groupWindowShow: PropTypes.func,
	groupWindowHide: PropTypes.func
};

const mapStateToProps = state => ({
	active: state.view,
	eventWindow: state.eventWindow,
	groups: state.groups,
	groupWindow: state.groupWindow,
	space: state.space.main
});

const mapDispatchToProps = dispatch => bindActionCreators({
	eventWindowShow,
	eventWindowHide,
	groupWindowShow,
	groupWindowHide,
	removeEvent
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Body);