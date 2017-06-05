import React from 'react';
import { reduxForm, Field } from 'redux-form';
import './signup.scss';

class Signup extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { handleSubmit, submit } = this.props;
    return (
      <form id='signup' className='auth__form' onSubmit={handleSubmit(submit)}>
        <h2 className='auth__title'>Sign up</h2>
        <Field className='auth__input' component='input' type='text' name='email' placeholder='email' />
        <Field className='auth__input' component='input' type='password' name='password' placeholder='pass' />
        <Field className='auth__input' component='input' type='password' name='repeat' placeholder='repeat pass' />
        <button className='auth__button' type='submit'>register</button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'signup'
})(Signup);