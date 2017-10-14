import React from 'react';
import PropTypes from 'prop-types';

import './view.scss';

const View = ({ name, active, onClick }) => {
	return (
			<li className="views__item">
				<a className={active ? 'views__link views__link_active' : 'views__link'} onClick={onClick}>
					{name}
				</a>
			</li>
	);
}

View.propTypes = {
	name: PropTypes.string,
	active: PropTypes.bool,
	onClick: PropTypes.func
};

export default View;