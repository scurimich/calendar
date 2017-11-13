import React, { PropTypes } from 'react';
import Social from './social.jsx';

import './footer.scss';

const socials = [
	{link: 'http://vk.com/atmofease', social: 'vk'},
	{link: 'http://www.facebook.com/Vlad.Tsykota', social: 'facebook-square'},
	{link: 'http://github.com/scurimich/', social: 'github'}
];

const Footer = ({ logout }) => (
	<footer className='footer'>
		<a className='footer__auth' onClick={logout}>Log out</a>
		<ul className='footer__socials socials'>
			{socials.map((val, ndx) => {
				return <Social link={val.link} soc={val.social} key={ndx} />
			})}
		</ul>
	</footer>
);

Footer.propTypes = {
  logout: PropTypes.func
};

export default Footer;