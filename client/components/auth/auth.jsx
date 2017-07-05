import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import Signup from './signup';
import Signin from './signin';

import { login, register, auth } from '../../actions/auth';
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
        <Signin submit={login} />
        <div className='auth__splitter'>
          <span className='auth__split-text'>or</span>
        </div>
        <Signup submit={register} />
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