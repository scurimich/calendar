import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MiniMonth from './minimonth';
import CurrentMonth from './currentmonth';
import { getMonthInfo } from '../../../utils';
import { MONTH_NAMES } from '../../../constants/calendar';

import {
	setDate,
	setSpace,
	setMiniSpace,
	incrMiniSpace,
	decrMiniSpace
} from '../../../actions/space';
import { setView } from '../../../actions/view';

import './MiniCalendar.scss';

class MiniCalendar extends React.Component {
	constructor(props) {
		super(props);
		this.setCurrentDate = this.setCurrentDate.bind(this);
	}

	getTitle() {
		const mini = this.props.space.mini;
		return `${MONTH_NAMES[mini.getMonth()]} ${mini.getFullYear()}`;
	}

	setCurrentDate(date) {
		const { setSpace, setMiniSpace, setDate } = this.props;
		setDate(date);
		setSpace(date);
		setMiniSpace(date);
	}

	render() {
		const { date, space, incrMiniSpace, decrMiniSpace, setSpace } = this.props;
		const monthInfo = getMonthInfo(space.mini);
		return (
			<div className="sidebar__calendar">
				<CurrentMonth
					title={this.getTitle()}
					onPrevClick={decrMiniSpace}
					onNextClick={incrMiniSpace}
				/>
				<MiniMonth
					date={date}
					miniSpace={space.mini}
					monthInfo={monthInfo}
					setCurrentDate={this.setCurrentDate}
				/>
			</div>
		);
	}
}

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