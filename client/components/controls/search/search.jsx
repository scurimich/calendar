import React from 'react';
import PropTypes from 'prop-types';

import './search.scss';

const Search = ({ str, onChange, onCancel }) => {
  const cancel = (
    <span className='search__cancel' onClick={onCancel}>
      <i className="fa fa-times" aria-hidden="true"></i>
    </span>
  );

	return (
		<form className="controls__search search">
			{str ? cancel : ''}
			<input type="text" className="search__input" placeholder="Search" value={str} onChange={onChange} />
		</form>
	);
}

Search.propTypes = {
	str: PropTypes.string,
	onChange: PropTypes.func,
	onCancel: PropTypes.func
};

export default Search;