import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { login } from '../../actions/auth';

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

const input = ({ input, name, label, type, required, meta: { touched, error } }) => {
  return (
    <label className='auth__label'> {label}
      <input className='auth__input' {...input} type={type} name={name} placeholder={label} />
      {touched && (error && <span className='auth__error'>{error}</span>)}
    </label>
  );
};

class Signin extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { handleSubmit } = this.props;
    return (
      <form id='sign' className='auth__form auth__form_signin' onSubmit={handleSubmit(login)}>
    		<h2 className='auth__title'>Login</h2>
    		<Field className='auth__input' component={input} type='text' name='email' label='Email' />
    		<Field className='auth__input' component={input} type='password' name='password' label='Password' />
    		<button className='auth__button'>login</button>
    	</form>
    );
  }
}

export default reduxForm({
  form: 'signin',
  validate
})(Signin);