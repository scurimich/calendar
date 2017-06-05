import React, { PropTypes } from 'react';
import { MONTH_NAMES } from '../../../constants/calendar';
import './currentspace.scss';

const CurrentDate = ({ onPrevClick, onNextClick, spaceString }) => {
	return (
		<div className="cur-day">
			<a className="cur-day__arr" href="#" onClick={onPrevClick}>
				<i className="fa fa-angle-left"></i>
			</a>
			<h2 className="cur-day__title">
				<a href="#" className="cur-day__link">
					{spaceString}
				</a>
			</h2>
			<a className="cur-day__arr" href="#" onClick={onNextClick}>
				<i className="fa fa-angle-right"></i>
			</a>
		</div>
	);
}

CurrentDate.propTypes = {
	onPrevClick: PropTypes.func,
	onNextClick: PropTypes.func,
	spaceString: PropTypes.string
};

export default CurrentDate;