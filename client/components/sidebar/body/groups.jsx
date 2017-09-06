import React from 'react';
import Select from 'react-select';

class Groups extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onValueClick = this.onValueClick.bind(this);
  }

  optionRenderer({ label, value, color }) {
    return (
      <div className='group-select__option'>
        <span className='group-select__color' style={ {backgroundColor: color} }></span>
        <span className='group-select__text'>{label}</span>
      </div>
    );
  }

  valueRenderer({ label, value, color }) {
    return (
      <div className='group-select__label'>
        <span className='group-select__remove fa fa-times'></span>
        <span className='group-select__change fa fa-cog'></span>
        <span className='group-select__color' style={ {backgroundColor: color} }></span>
        <span className='group-select__text'>{label}</span>
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
      const { removeGroup } = this.props;
      removeGroup(value);
    }
  }

  render() {
    const { groups, selectedGroup } = this.props;
    return (
      <Select 
        className='group-select'
        placeholder='Group filter'
        clearable={true}
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

export default Groups;