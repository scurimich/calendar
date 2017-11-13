import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import { login } from '../../actions/auth.js';

import './signin.scss';

const input = ({ input, name, label, type, meta: { touched, error, active } }) => (
  <label className='signin__label'> {label}
    <input className='signin__input' {...input} type={type} name={name} placeholder={label} />
    {!active && touched && (error && <span className='signin__error'>{error}</span>)}
  </label>
);

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

const Signin = ({ handleSubmit }) => (
  <form id='sign' className='auth__signin signin' onSubmit={handleSubmit(login)}>
		<h2 className='signin__head'>Log in</h2>
		<Field component={input} type='text' name='email' label='Email' />
		<Field component={input} type='password' name='password' label='Password' />
		<button className='signin__button'>login</button>
	</form>
);

Signin.propTypes = {
  handleSubmit: PropTypes.func,
  submit: PropTypes.func
};

export default reduxForm({
  form: 'signin',
  validate
})(Signin);