import React from 'react';
import PropTypes from 'prop-types';

import MonthWeek from './monthweek.jsx';
import { WEEKDAYS } from '../../../constants/calendar.js';
import calendarInfo from '../../../hoc/calendarinfo.jsx';

import './month.scss';

class Month extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			space,
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
								firstDay={firstDay}
								key={ndx}
								weekNdx={ndx}
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
	space: PropTypes.object,
	getWeek: PropTypes.func,
	getWeeks: PropTypes.func
}

export default calendarInfo(Month);