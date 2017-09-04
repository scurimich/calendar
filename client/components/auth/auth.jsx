import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import Signup from './signup.jsx';
import Signin from './signin.jsx';

import { auth } from '../../actions/auth.js';
import './auth.scss';

class Auth extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { auth, user } = this.props;
    const { authenticated } = user;
    const token = localStorage.getItem('token');

    if (token && !authenticated) {
      auth(token);
      return (
        <div className='auth__spin-container'>
          <span className='auth__spinner'>
            <i className="fa fa-spinner" aria-hidden="true"></i>
          </span>
        </div>
      );
    }
    if (authenticated) return <Redirect to='/' />;
    return (
      <div className='auth'>
        <Signin />
        <div className='auth__splitter'>
          <span className='auth__split-text'>or</span>
        </div>
        <Signup />
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

export default connect(mapStateToProps, mapDispatchToProps)(Auth);