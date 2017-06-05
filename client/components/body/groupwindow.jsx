import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import './groupwindow.scss';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const textInput = ({ input, label, type, required, meta: { touched, error } }) => {
  return (
    <div className='group-window__input-container'>
      <input className='group-window__input' {...input} placeholder={label} type={type} />
      {touched && (error && <span className='message message_error'>{error}</span>)}
    </div>
  )
};

const validate = values => {
  // console.log(values)
  const errors = {};
  if (!values.name) errors.name = 'Required';
  return errors;
}

class GroupWindow extends React.Component {
  constructor(props) {
    super(props);

    this.changeState = this.changeState.bind(this);
    this.submit = this.submit.bind(this);
  }

  popupClasses() {
    let classes = 'group-window'
    return this.props.window.showed ? classes += ' opened' : classes;
  }

  changeState(e) {
    const field = e.currentTarget;
    const data = {};
    data[field.name] = field.checked;
    this.setState(data);
  }

  submit(values) {
    return sleep(0)
    .then(() => {
      const error = validate(values);
      if (Object.keys(error).length) throw new SubmissionError(error);
      this.props.sendData(values);
    });
  }

  render() {
    const { handleSubmit, onWindowClose, window, addGroup, reset } = this.props;
    return (
      <div className={this.popupClasses()} id='group-window'>
        <div className='group-window__popup'>
          <span className='group-window__close' onClick={onWindowClose}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </span>
          <h2 className='group-window__head'>Add Group</h2>
          <form className='group-window__form' onSubmit={handleSubmit(this.submit)}>
            <label className='group-window__text-label'>Name and Color</label>
            <div className='group-window__inputs'>
              <Field component={textInput} type='text' name='name' label='Name'/>
              <Field component='input' className='group-window__color' type='color' name='color'/>
            </div>
            <div className='group-window__control'>
              <button className='group-window__button' type='submit'>submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'group',
  enableReinitialize: true,
  validate
})(GroupWindow);