import React, { PropTypes } from 'react';
import './additem.scss';

const AddItem = ({ addEvent, addGroup }) => (
  <div className='add'>
    <div className='add-event'>
      <a className='add-event__button' href='#' onClick={addEvent}>add event</a>
    </div>
    <div className='add-group'>
      <a className='add-group__button' href='#' onClick={addGroup}>add group</a>
    </div>
  </div>
);

AddItem.propTypes = {
  addEvent: PropTypes.func,
  addGroup: PropTypes.func
};

export default AddItem;