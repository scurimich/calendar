import React, { PropTypes } from 'react';
import Social from './Social.jsx';

import './Footer.scss';

const socials = [
	{link: 'http://vk.com/atmofease', social: 'vk'},
	{link: 'http://www.facebook.com/Vlad.Tsykota', social: 'facebook-square '},
	{link: 'http://github.com/scurimich/', social: 'github'}
];

const Footer = ({ logout }) => (
	<footer className='footer'>
		<div className='footer__head'>
			<div className='footer__controls'>
				<span className='footer__auth' onClick={logout}>Log out</span>
			</div>
			<div className='footer__socials socials'>
				<ul className='socials__list'>
					{socials.map((val, ndx) => {
						return <Social link={val.link} soc={val.social} key={ndx} />
					})}
				</ul>
			</div>
		</div>
		<div className='footer__bot'>
			<small className='footer__copyright'>2017 tsykota.vlad <i className="fa fa-copyright" aria-hidden="true"></i></small>
		</div>
	</footer>
);

Footer.propTypes = {
  logout: PropTypes.func
};

export default Footer;