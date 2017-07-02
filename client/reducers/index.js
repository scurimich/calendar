import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import user from './user';
import search from './search';
import view from './view';
import date from './date';
import events from './events';
import eventsStatus from './eventsstatus';
import eventWindow from './eventwindow';
import selected from './selected';
import groups from './groups';
import groupsStatus from './groupsstatus';
import groupWindow from './groupwindow';
import sidebar from './sidebar';
import space from './space';
import viewInfo from './viewinfo';

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