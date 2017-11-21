import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
	setDate,
	setSpace,
	setMiniSpace,
	incrMiniSpace,
	decrMiniSpace
} from '../../../actions/space';
import { setView } from '../../../actions/view';

import MiniMonth from './minimonth.jsx';
import CurrentMonth from './currentmonth.jsx';

import './minicalendar.scss';

class MiniCalendar extends React.Component {
	constructor(props) {
		super(props);
		
		this.setCurrentDate = this.setCurrentDate.bind(this);
	}

	setCurrentDate(date) {
		const { setSpace, setMiniSpace, setDate } = this.props;
		setDate(date);
		setSpace(date);
		setMiniSpace(date);
	}

	render() {
		const { date, space, incrMiniSpace, decrMiniSpace, setSpace } = this.props;
		return (
			<div className="sidebar__calendar">
				<CurrentMonth
					space={space.mini}
					onPrevClick={decrMiniSpace}
					onNextClick={incrMiniSpace}
				/>
				<MiniMonth
					date={date}
					space={space.mini}
					setCurrentDate={this.setCurrentDate}
				/>
			</div>
		);
	}
}

MiniCalendar.propTypes = {
	date: PropTypes.object,
	space: PropTypes.object
};

const mapStateToProps = (state) => ({
	date: state.date,
	space: state.space
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	setDate,
	setSpace,
	setMiniSpace,
	incrMiniSpace,
	decrMiniSpace,
	setView
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MiniCalendar);