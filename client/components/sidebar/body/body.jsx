import React from 'react';
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

class SidebarBody extends React.Component {
  constructor(props) {
    super(props);
  }

  searchEvents() {
    const { search, events } = this.props;
    return events.filter(event => {
      const title = event.title.toLowerCase();
      const description = event.description && event.description.toLowerCase();
      if ((title && title.indexOf(search) + 1) ||
        (description && description.indexOf(search) + 1)) return event;
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

    return (
      <div className='sidebar__body'>
        {search ?
          (
            <SearchResult
              search={search}
              events={this.searchEvents()}
              groups={groups}
              eventWindowShow={eventWindowShow}
            />
          ) :
          (
            <div className='side-events'>
              <AddItem addEvent={eventWindowShow.bind(null, null)} addGroup={groupWindowShow.bind(null, null)} />
              <Groups 
                selectedGroup={currentGroup}
                groups={groups}
                selectGroup={selectGroup}
                groupWindowShow={groupWindowShow}
                removeGroup={removeGroup}
                groupWindowShow={groupWindowShow}
              />
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
          )
        }
      </div>
    );
  }
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