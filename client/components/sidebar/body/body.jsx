import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { groupWindowShow } from '../../../actions/groupwindow';
import { eventWindowShow } from '../../../actions/eventwindow';
import { fetchEvents } from '../../../actions/events';
import { fetchGroups } from '../../../actions/groups';

import SearchResult from './searchresults';
import AddItem from './additem';
import Events from './events';

class SidebarBody extends React.Component {
  constructor(props) {
    super(props);
  }

  searchEvents() {
    const { search, events } = this.props;
    return events.filter(event => {
      const title = event.title.toLowerCase();
      const description = event.description.toLowerCase();
      if ((title.indexOf(search) + 1) ||
        (description.indexOf(search) + 1)) return event;
    });
  }

  renderEvents() {
    const { user, date, events, eventWindowShow, groupWindowShow, fetchEvents, eventsStatus, fetchGroups, groupsStatus } = this.props;
    return (
      <div className='side-events'>
        <AddItem addEvent={eventWindowShow} addGroup={groupWindowShow} />
        <Events
          date={date}
          events={events}
          auth={user.authenticated}
          fetchEvents={fetchEvents}
          eventsStatus={eventsStatus}
          fetchGroups={fetchGroups}
          groupsStatus={groupsStatus}
        />
      </div>
    );
  }

  getContent() {
    const { search, groups, eventWindowShow } = this.props;
    if (search) return (
      <SearchResult
        search={search}
        events={this.searchEvents()}
        groups={groups}
        eventWindowShow={eventWindowShow}
      />
    );
    return this.renderEvents();
  }

  render() {
    return (
      <div className='sidebar__body'>
        {this.getContent()}
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
  groupsStatus: state.groupsStatus
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  eventWindowShow,
  groupWindowShow,
  fetchEvents,
  fetchGroups
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SidebarBody);