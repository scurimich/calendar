import React from 'react';
import PropTypes from 'prop-types';

import './currentspace.scss';

const CurrentDate = ({ onPrevClick, onNextClick, spaceString }) => (
	<div className='controls__current-day current-day'>
		<a className='current-day__arrow' onClick={onPrevClick}>
			<i className='fa fa-angle-left'></i>
		</a>
		<span className='current-day__title'>
			{spaceString}
		</span>
		<a className='current-day__arrow' onClick={onNextClick}>
			<i className='fa fa-angle-right'></i>
		</a>
	</div>
);

CurrentDate.propTypes = {
	onPrevClick: PropTypes.func,
	onNextClick: PropTypes.func,
	spaceString: PropTypes.string
};

export default CurrentDate;