import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { groupWindowShow } from '../../../actions/groupwindow.js';
import { eventWindowShow } from '../../../actions/eventwindow.js';
import { fetchEvents } from '../../../actions/events.js';
import { fetchGroups, removeGroup } from '../../../actions/groups.js';
import { selectGroup } from '../../../actions/filter.js';

import SearchResult from './searchresults.jsx';
import AddItem from './additem.jsx';
import Events from './events.jsx';
import Groups from './groups.jsx';

import './body.scss';

class SidebarBody extends React.Component {
  searchEvents() {
    const { search, events } = this.props;
    return events.filter(event => {
      const title = event.title.toLowerCase();
      const description = event.description && event.description.toLowerCase();
      return (title && title.indexOf(search) + 1) || (description && description.indexOf(search) + 1);
    });
  }

  render() {
    const {
      search,
      groups,
      user,
      date,
      events,
      eventWindowShow,
      groupWindowShow,
      fetchEvents,
      fetchGroups,
      eventsStatus,
      groupsStatus,
      currentGroup,
      selectGroup,
      removeGroup
    } = this.props;

    const searchResults = (
      <SearchResult
        search={search}
        events={this.searchEvents()}
        groups={groups}
        eventWindowShow={eventWindowShow}
      />
    );
    const groupsComponent = (
      <Groups 
        selectedGroup={currentGroup}
        groups={groups}
        selectGroup={selectGroup}
        groupWindowShow={groupWindowShow}
        removeGroup={removeGroup}
        groupWindowShow={groupWindowShow}
      />
    );

    const sidebarInfo = (
      <div className='sidebar__events events'>
        {(groups.length && groupsComponent) || ''}
        <Events
          date={date}
          events={events}
          groups={groups}
          auth={user.authenticated}
          fetchEvents={fetchEvents}
          eventsStatus={eventsStatus}
          fetchGroups={fetchGroups}
          groupsStatus={groupsStatus}
          eventWindowShow={eventWindowShow}
          currentGroup={currentGroup}
        />
      </div>
    );

    return (
      <div className='sidebar__body'>
        <AddItem addEvent={eventWindowShow.bind(null, null)} addGroup={groupWindowShow.bind(null, null)} />
        { search ? searchResults : sidebarInfo }
      </div>
    )
  }
};

SidebarBody.propTypes = {
  date: PropTypes.object,
  events: PropTypes.array,
  groups: PropTypes.array,
  user: PropTypes.object,
  search: PropTypes.string,
  eventsStatus: PropTypes.object,
  groupsStatus: PropTypes.object,
  currentGroup: PropTypes.object,
  eventWindowShow: PropTypes.func,
  groupWindowShow: PropTypes.func,
  fetchEvents: PropTypes.func,
  fetchGroups: PropTypes.func,
  selectGroup: PropTypes.func,
  removeGroup: PropTypes.func
};

const mapStateToProps = (state) => ({
  date: state.date,
  events: state.events,
  groups: state.groups,
  user: state.user,
  search: state.search,
  eventsStatus: state.eventsStatus,
  groupsStatus: state.groupsStatus,
  currentGroup: state.currentGroup
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  eventWindowShow,
  groupWindowShow,
  fetchEvents,
  fetchGroups,
  selectGroup,
  removeGroup
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SidebarBody);