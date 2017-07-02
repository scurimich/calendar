import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { register } from '../../actions/auth';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const input = ({ input, name, label, type, required, meta: { touched, error } }) => {
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
  if (!values.repeat) {
    errors.repeat = 'Required';
  } else if (values.repeat !== values.password) {
    errors.repeat = 'Must match the "Password" field';
  }
  return errors;
}

class Signup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form id='signup' className='auth__form auth__form_signup' onSubmit={handleSubmit(register)}>
        <h2 className='auth__title'>Create new account</h2>
        <Field component={input} label='Email' type='text' name='email' />
        <Field component={input} label='Password' type='text' name='password' />
        <Field component={input} label='Repeat password' type='text' name='repeat' />
        <button className='auth__button' type='submit'>register</button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'signup',
  validate
})(Signup);