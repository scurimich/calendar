import React from 'react';
import PropTypes from 'prop-types';

import './currentmonth.scss';

const CurrentMonth = ({ space, onPrevClick, onNextClick }) => (
	<div className='current-month'>
		<h1 className="current-month__title">{space.format('MMMM YYYY')}</h1>
		<div className='current-month__control'>
			<a className="current-month__arrow" onClick={onPrevClick}>
				<i className="fa fa-angle-left"></i>
			</a>
			<a className="current-month__arrow" onClick={onNextClick}>
				<i className="fa fa-angle-right"></i>
			</a>
		</div>
	</div>
);

CurrentMonth.propTypes = {
	space: PropTypes.object,
	onPrevClick: PropTypes.func,
	onNextClick: PropTypes.func
};

export default CurrentMonth;