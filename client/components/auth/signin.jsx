import React, { PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';

const input = ({ input, name, label, type, meta: { touched, error } }) => {
  return (
    <label className='auth__label'> {label}
      <input className='auth__input' {...input} type={type} name={name} placeholder={label} />
      {touched && (error && <span className='auth__error'>{error}</span>)}
    </label>
  );
};

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[\w-_]+@\w+.\w{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 6) {
    errors.password = 'Must be more than 6 and less than 20 characters'
  }
  return errors;
}

const Signin = ({ handleSubmit, submit }) => {
  return (
    <form id='sign' className='auth__form auth__form_signin' onSubmit={handleSubmit(submit)}>
  		<h2 className='auth__title'>Login</h2>
  		<Field className='auth__input' component={input} type='text' name='email' label='Email' />
  		<Field className='auth__input' component={input} type='password' name='password' label='Password' />
  		<button className='auth__button'>login</button>
  	</form>
  );
}

Signin.propTypes = {
  handleSubmit: PropTypes.func,
  submit: PropTypes.func
};

export default reduxForm({
  form: 'signin',
  validate
})(Signin);