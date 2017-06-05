import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MiniCalendar from './minicalendar/minicalendar';
import Body from './body/body';
import Footer from './footer/footer';
import { TODAY } from '../../constants/calendar';
import { logout } from '../../actions/auth';

import './sidebar.scss';

export default class Sidebar extends React.Component {
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