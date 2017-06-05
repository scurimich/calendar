import React from 'react';
import { reduxForm, Field } from 'redux-form';
import './signin.scss';

class Signin extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { handleSubmit, submit } = this.props;
    return (
      <form id='sign' className='auth__form' onSubmit={handleSubmit(submit)}>
    		<h2 className='auth__title'>Sign in</h2>
      		<Field className='auth__input' component='input' type='text' name='email' placeholder='email' />
      		<Field className='auth__input' component='input' type='password' name='password' placeholder='pass' />
      		<button className='auth__button'>login</button>
    	</form>
    );
  }
}

export default reduxForm({
  form: 'signin'
})(Signin);