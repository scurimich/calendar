import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import { logout } from '../../actions/auth.js';

import MiniCalendar from './minicalendar/minicalendar.jsx';
import Body from './body/body.jsx';
import Footer from './footer/footer.jsx';

import './sidebar.scss';

class Sidebar extends React.Component {
	render() {
		const { logout, sidebar } = this.props;
		return (
			<aside className={classNames('sidebar', {'active': sidebar})} ref={(node) => {this.sidebar = node;}}>
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

const mapStateToProps = state => ({
	sidebar: state.sidebar
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	logout
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Sidebar);