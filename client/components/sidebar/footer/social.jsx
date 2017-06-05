import React, { PropTypes } from 'react';

const Social = ({ link, soc }) => {
	return (
		<li className='socials__item'>
			<a className='socials__link' target='_blank' href={link}>
				<i className={`fa fa-${soc}`} aria-hidden="true"></i>
			</a>
		</li>
	);
};

Social.propTypes = {
	link: PropTypes.string,
	soc: PropTypes.string
};

export default Social;