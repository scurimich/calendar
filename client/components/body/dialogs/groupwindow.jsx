import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';

import './groupwindow.scss';

const textInput = ({ input, label, type, required, meta: { touched, error, active } }) => (
  <div className='group-window__input-container'>
    <input className='group-window__input' {...input} placeholder={label} type={type} />
    {!active && touched && (error && <span className='message message_error'>{error}</span>)}
  </div>
)

const validate = values => {
  const errors = {};
  if (!values.label) errors.label = 'Required';

  return errors;
}

class GroupWindow extends React.Component {
  componentDidUpdate() {
    const { groupWindow } = this.props;
    if (groupWindow.showed) document.addEventListener('keydown', this.keypressEsc.bind(this));
    else document.removeEventListener('keydown', this.keypressEsc);
  }

  keypressEsc(e) {
    const { groupWindowHide } = this.props;
    if (e.which === 27) groupWindowHide();
  }

  render() {
    const { handleSubmit, groupWindowHide, addGroup, updateGroup, initialValues, groupWindow } = this.props;
    const id = initialValues._id;
    const submit = id ? updateGroup : addGroup;

    return (
      <div className={classNames('group-window', {'opened': groupWindow.showed})} id='group-window'>
        <div className='group-window__popup'>
          <div className='group-window__head'>
            <h2 className='group-window__title'>{id ? 'Update' : 'Add'} Group</h2>
            <span className='group-window__close' onClick={groupWindowHide}>×</span>
          </div>
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

GroupWindow.propTypes = {
  addGroup: PropTypes.func,
  groupWindow: PropTypes.object,
  groupWindowHide: PropTypes.func,
  updateWindow: PropTypes.func
};

export default connect(state => ({initialValues: state.groupWindow.data}), null)(reduxForm({
  form: 'group',
  enableReinitialize: true,
  validate
})(GroupWindow));