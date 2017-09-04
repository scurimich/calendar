import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MiniCalendar from './minicalendar/minicalendar.jsx';
import Body from './body/body.jsx';
import Footer from './footer/footer.jsx';
import { TODAY } from '../../constants/calendar.js';
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
				<MiniCalendar />
				<Body />
				<Footer logout={logout} />
			</aside>
		)
	}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
	logout
}, dispatch);

export default connect(null, mapDispatchToProps)(Sidebar);