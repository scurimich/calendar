import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';

import { auth } from '../../actions/auth.js';

import Signup from './signup.jsx';
import Signin from './signin.jsx';

import './auth.scss';

class Auth extends React.Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    const { auth, user } = this.props;
    const { authenticated } = user;

    if (token && !authenticated) {
      auth(token);
    }
  }

  render() {
    const token = localStorage.getItem('token');
    const { auth, user } = this.props;
    const { authenticated } = user;

    const waiting = <div className='waiting'><span className='waiting__spinner'></span></div>

    if (token && !authenticated) {
      return waiting;
    }

    if (authenticated) return <Redirect to='/' />;

    return (
      <div className='auth'>
        <div className='auth__container'>
        <Signin />
        <div className='auth__splitter'>
          <span className='auth__splitter-text'>or</span>
        </div>
        <Signup />
        </div>
      </div>
    );
  }
}

Auth.propTypes = {
  auth: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => bindActionCreators({
  auth
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Auth);