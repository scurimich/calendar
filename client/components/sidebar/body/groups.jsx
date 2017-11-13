import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import 'react-select/dist/react-select.css';
import './groups.scss';

class Groups extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onValueClick = this.onValueClick.bind(this);
  }

  valueRenderer({ label, color }) {
    return (
      <div className='group-select__label'>
        <span className='group-select__remove fa fa-trash'></span>
        <span className='group-select__change fa fa-cog'></span>
        <span className='group-select__color' style={ {backgroundColor: color} }></span>
        <span className='group-select__text'>{label}</span>
      </div>
    );
  }

  optionRenderer({ label, color }) {
    return (
      <div className='group-select__option group-option'>
        <span className='group-option__color' style={ {backgroundColor: color} }></span>
        <span className='group-option__text'>{label}</span>
      </div>
    );
  }

  onChange(value) {
    const { selectGroup } = this.props;
    selectGroup(value);
  }

  onValueClick(value, e) {
    const classes = Array.from(e.target.classList);
    if (classes.indexOf('group-select__change') + 1) {
      const { groupWindowShow } = this.props;
      groupWindowShow(value);
    }
    if (classes.indexOf('group-select__remove') + 1) {
      const { removeGroup, selectGroup } = this.props;
      removeGroup(value);
      selectGroup(null);
    }
  }

  render() {
    const { groups, selectedGroup } = this.props;
    return (
      <Select 
        className='events__group-select group-select'
        placeholder='Groups'
        clearable={true}
        searchable={false}
        options={groups}
        optionRenderer={this.optionRenderer}
        valueRenderer={this.valueRenderer}
        onChange={this.onChange}
        onValueClick={this.onValueClick}
        value={selectedGroup}
        backspaceRemoves={false}
      />
    );
  }
};

Groups.propTypes = {
  selectedGroup: PropTypes.object,
  groups: PropTypes.array,
  selectGroup: PropTypes.func,
  groupWindowShow: PropTypes.func,
  removeGroup: PropTypes.func,
  groupWindowShow: PropTypes.func
}

export default Groups;