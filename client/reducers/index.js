import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import user from './user.js';
import search from './search.js';
import view from './view.js';
import date from './date.js';
import events from './events';
import eventsStatus from './eventsstatus.js';
import eventWindow from './eventwindow.js';
import selected from './selected.js';
import groups from './groups.js';
import groupsStatus from './groupsstatus.js';
import groupWindow from './groupwindow.js';
import sidebar from './sidebar.js';
import space from './space.js';
import viewInfo from './viewinfo.js';

const reducer = combineReducers({
	form,
	user,
	view,
	viewInfo,
	date,
	search,
	events,
	eventsStatus,
	eventWindow,
	selected,
	groups,
	groupsStatus,
	groupWindow,
	sidebar,
	space,
	router: routerReducer
});

export default reducer;