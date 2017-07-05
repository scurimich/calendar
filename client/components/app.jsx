import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';

import Sidebar from './sidebar/sidebar';
import Controls from './controls/controls';
import Body from './body/body';

import { login, register, auth } from '../actions/auth';
import './app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { auth, user } = this.props;
    const { authenticated } = user;
    const token = localStorage.getItem('token');
    if (!token) return <Redirect to='/login' />;
    if (token && !authenticated) auth(token);
    return (
      <div className="container">
        <Sidebar />
        <div className="content">
          <Controls />
          <Body />
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => bindActionCreators({
  auth
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
