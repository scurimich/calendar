import React from 'react';
import PropTypes from 'prop-types';
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

import { DAYS_IN_WEEK } from '../../constants/calendar.js';

import './controls.scss';

const viewsList = ['Day', 'Week', 'Month', 'Year'];

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
				return type ? setSpaces(space.clone().add(DAYS_IN_WEEK - day, 'days')) : setSpaces(space.clone().subtract(day + DAYS_IN_WEEK, 'days'));
			case 'Month':
				return type ? setSpaces(space.clone().add(1, 'months')) : setSpaces(space.clone().subtract(1, 'months'));
			case 'Year':
				return type ? setSpaces(space.clone().add(1, 'years')) : setSpaces(space.clone().subtract(1, 'years'));
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
				const weekDay = space.day() ? space.day() - 1 : 6;
				const weekBegin = space.clone().subtract(weekDay, 'days');
				const weekEnd = space.clone().add(DAYS_IN_WEEK - weekDay - 1, 'days');
				return `${weekBegin.format('D.MM.YYYY')} - ${weekEnd.format('D.MM.YYYY')}`;
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
			<header className='content__controls controls'>
				<CurrentSpace
					spaceString={this.spaceString()}
					onPrevClick={this.prevClick}
					onNextClick={this.nextClick}
				/>
				<ul className='controls__views views'>
					{viewsList.map((view, ndx) => {
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

Controls.propTypes = {
	activeView: PropTypes.string,
	date: PropTypes.object,
	search: PropTypes.string,
	space: PropTypes.object,
	changeSearchStr: PropTypes.func,
	setView: PropTypes.func,
	setSpace: PropTypes.func,
	setMiniSpace: PropTypes.func
};

const mapStateToProps = (state) => {
	// console.log('---------------------------')
	// console.log(state.selected)
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