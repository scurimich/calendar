import React from 'react';
import Signup from './signup';
import Signin from './signin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { login, register, auth } from '../../actions/auth';
import './auth.scss';

class Auth extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { login, register, user } = this.props;

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

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  login,
  register,
  auth
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Auth);