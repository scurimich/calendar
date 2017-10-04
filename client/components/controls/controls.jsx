import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import View from './view/view.jsx';
import Search from './search/search.jsx';
import CurrentSpace from './currentspace/currentspace.jsx';

import {
	setSpace,
	setMiniSpace
} from '../../actions/space.js';
import { setView } from '../../actions/view.js';
import { changeSearchStr } from '../../actions/search.js';

import { MONTH_NAMES, DAYS_IN_WEEK } from '../../constants/calendar.js';

import './controls.scss';

const viewList = ['Day', 'Week', 'Month', 'Year'];

class Controls extends React.Component {
	constructor(props) {
		super(props);
		this.prevClick = this.arrowClick.bind(this, false);
		this.nextClick = this.arrowClick.bind(this, true);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSearchCancel = this.onSearchCancel.bind(this);
		this.setSpaces = this.setSpaces.bind(this);
	}

	onSearchChange(e) {
		const { changeSearchStr } = this.props;
		changeSearchStr(e.target.value);
	}

	onSearchCancel() {
		const { changeSearchStr } = this.props;
		changeSearchStr('');
	}

	arrowClick(type) {
		const {
			space,
			activeView
		} = this.props;
		const { setSpaces } = this;
		switch(activeView) {
			case 'Day':
				return type ? setSpaces(space.clone().add(1, 'days')) : setSpaces(space.clone().subtract(1, 'days'));
			case 'Week':
			const day = space.day() ? space.day() - 1 : 6;
				return type ? setSpaces(space.clone().add(DAYS_IN_WEEK - day, 'days')) : setSpaces(space.clone().subtract(DAYS_IN_WEEK - day, 'days'));
			case 'Month':
				return type ? setSpaces(space.clone().add(1, 'months')) : setSpaces(space.clone().subtract(1, 'months'));
			case 'Year':
				return type ? setSpaces(space.clone().add(1, 'years')) : setSpaces(space.clone().subtract(1, 'months'));
		}
	}

	setSpaces(date) {
		const { setSpace, setMiniSpace } = this.props;
		setSpace(date);
		setMiniSpace(date);
	}

	spaceString() {
		const { space, activeView } = this.props;
		switch(activeView) {
			case 'Day':
				return space.format('DD MMMM YYYY');
			case 'Week': 
				const weekDay = space.day() ? space.day() - 1 : DAYS_IN_WEEK;
				const weekBegin = space.clone().subtract(weekDay, 'days');
				const weekEnd = space.clone().add(DAYS_IN_WEEK - weekDay - 1, 'days');
				return `${weekBegin.format('DD.MM.YYYY')} - ${weekEnd.format('DD.MM.YYYY')}`;
			case 'Year':
				return space.format('YYYY');
			case 'MONTH':
			default:
				return space.format('MMMM YYYY');
		}
	}

	render() {
		const { search, activeView, setView } = this.props;
		return (
			<header className="controls">
				<CurrentSpace
					spaceString={this.spaceString()}
					onPrevClick={this.prevClick}
					onNextClick={this.nextClick}
				/>
				<ul className="controls__views views">
					{viewList.map((view, ndx) => {
						return (
							<View 
								name={view}
								active={activeView === view}
								onClick={setView.bind(null, view)}
								key={ndx}
							/>
						);
					})}
				</ul>
				<Search
					str={search}
					onChange={this.onSearchChange}
					onCancel={this.onSearchCancel}
				/>
			</header>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		activeView: state.view,
		date: state.date,
		search: state.search,
		space: state.space.main
	}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
	changeSearchStr,
	setView,
	setSpace,
	setMiniSpace
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Controls);