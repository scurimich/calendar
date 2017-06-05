import React, { PropTypes } from 'react';

import './currentmonth.scss';

const CurrentMonth = ({ title, onPrevClick, onNextClick }) => (
	<div className='cur-month'>
		<h2 className="cur-month__title">{title}</h2>
		<div className='cur-month__control'>
			<a className="cur-month__arrow" onClick={onPrevClick}>
				<i className="fa fa-angle-left"></i>
			</a>
			<a className="cur-month__arrow" onClick={onNextClick}>
				<i className="fa fa-angle-right"></i>
			</a>
		</div>
	</div>
);

CurrentMonth.propTypes = {
	title: PropTypes.string,
	onPrevClick: PropTypes.func,
	onNextClick: PropTypes.func
};

export default CurrentMonth;