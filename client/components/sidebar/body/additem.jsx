import React from 'react';
import PropTypes from 'prop-types';
import './additem.scss';

const AddItem = ({ addEvent, addGroup }) => (
  <div className='sidebar__add add'>
    <a className='add__button' onClick={addEvent}>add event</a>
    <a className='add__button' onClick={addGroup}>add group</a>
  </div>
);

AddItem.propTypes = {
  addEvent: PropTypes.func,
  addGroup: PropTypes.func
};

export default AddItem;