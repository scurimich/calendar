import React, { PropTypes } from 'react';

import './Search.scss';

const Search = ({ str, onChange, onCancel }) => {
	return (
		<form className="search">
			{str ? <span className='search__cancel' onClick={onCancel}><i className="fa fa-times" aria-hidden="true"></i></span> : ''}
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