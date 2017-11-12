import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './view.scss';

const View = ({ name, active, onClick }) => (
	<li className="views__item">
		<a className={classNames('views__link', {'views__link_active': active})} onClick={onClick}>
			{name}
		</a>
	</li>
);

View.propTypes = {
	name: PropTypes.string,
	active: PropTypes.bool,
	onClick: PropTypes.func
};

export default View;