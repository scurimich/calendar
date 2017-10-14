import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MiniCalendar from './minicalendar/minicalendar.jsx';
import Body from './body/body.jsx';
import Footer from './footer/footer.jsx';
import { logout } from '../../actions/auth.js';

import './sidebar.scss';

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const { logout } = this.props;
		return (
			<aside className="sidebar">
				<MiniCalendar className='' />
				<Body />
				<div className='sidebar__footer'>
					<Footer logout={logout} />
				</div>
			</aside>
		)
	}
}

Sidebar.propTypes = {
	logout: PropTypes.func
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
	logout
}, dispatch);

export default connect(null, mapDispatchToProps)(Sidebar);