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
				return type ? setSpaces(new Date(space.setDate(space.getDate() + 1))) : setSpaces(new Date(space.setDate(space.getDate() - 1)));
			case 'Week':
			const day = space.getDay() ? space.getDay() - 1 : 6;
				return type ? setSpaces(new Date(space.setDate(space.getDate() + DAYS_IN_WEEK - day))) : setSpaces(new Date(space.setDate(space.getDate() - DAYS_IN_WEEK + day)));
			case 'Month':
				return type ? setSpaces(new Date(space.getFullYear(), space.getMonth() + 1)) : setSpaces(new Date(space.getFullYear(), space.getMonth() - 1));
			case 'Year':
				return type ? setSpaces(new Date(space.getFullYear() + 1)) : setSpaces(new Date(space.getFullYear() - 1));
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
				return `${space.getDate()} ${MONTH_NAMES[space.getMonth()]} ${space.getFullYear()}`;
			case 'Week': 
				const weekDay = space.getDay() ? space.getDay() - 1 : DAYS_IN_WEEK;
				const weekBegin = new Date(space.getFullYear(), space.getMonth(), space.getDate() - weekDay);
				const weekEnd = new Date(space.getFullYear(), space.getMonth(), space.getDate() + (DAYS_IN_WEEK - weekDay) - 1);
				return `${weekBegin.getDate()}.${weekBegin.getMonth() + 1}.${weekBegin.getFullYear()} - ${weekEnd.getDate()}.${weekEnd.getMonth() + 1}.${weekEnd.getFullYear()}`;
			case 'Month':
				return `${MONTH_NAMES[space.getMonth()]} ${space.getFullYear()}`;
			case 'Year':
				return space.getFullYear().toString();
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