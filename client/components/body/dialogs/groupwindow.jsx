import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import './groupwindow.scss';

const textInput = ({ input, label, type, required, meta: { touched, error } }) => {
  return (
    <div className='group-window__input-container'>
      <input className='group-window__input' {...input} placeholder={label} type={type} />
      {touched && (error && <span className='message message_error'>{error}</span>)}
    </div>
  )
};

const validate = values => {
  const errors = {};
  if (!values.label) errors.label = 'Required';
  return errors;
}

class GroupWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  popupClasses() {
    let classes = 'group-window'
    return this.props.groupWindow.showed ? classes += ' opened' : classes;
  }

  render() {
    const { handleSubmit, onWindowClose, addGroup, updateGroup, initialValues } = this.props;
    const id = initialValues._id;
    const submit = id ? updateGroup : addGroup;
    return (
      <div className={this.popupClasses()} id='group-window'>
        <div className='group-window__popup'>
          <span className='group-window__close' onClick={onWindowClose}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </span>
          <h2 className='group-window__head'>{id ? 'Update' : 'Add'} Group</h2>
          <form className='group-window__form' onSubmit={handleSubmit(submit)}>
            <label className='group-window__text-label'>Name and Color</label>
            <div className='group-window__inputs'>
              <Field component={textInput} type='text' name='label' label='Name'/>
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

export default connect(state => ({initialValues: state.groupWindow.data}), null)(reduxForm({
  form: 'group',
  enableReinitialize: true,
  validate
})(GroupWindow));