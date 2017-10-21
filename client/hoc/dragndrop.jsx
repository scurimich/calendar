import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectEvent, changeSelectedEvent, removeEventSelection } from '../actions/selectedevent.js';
import { updateEvent } from '../actions/events.js';
import { eventWindowShow } from '../actions/eventwindow.js';


const dragAndDrop = (Component) => {

  class DNDComponent extends React.Component {
    constructor(props) {
      super(props);
      this.eventDragAndDrop = this.eventDragAndDrop.bind(this);
      this.event = {};
    }

    eventDragAndDrop(e) {
      e.preventDefault();
      const { events, selectedEvent } = this.props;
      const element = e.currentTarget;
      const event = selectedEvent || events.find(event => event._id === element.id);
      const baseElement = document.querySelector('[data-dd]');
      this.mainElement = document.querySelector('[data-dnd]');

      window.onmouseup = this.eventOnDrop.bind(this, event);
      this.timeout = setTimeout(function() {
        document.onmousemove = this.eventOnMove.bind(this, element, event);
      }.bind(this), 50);
    }

    eventOnMove(element, event, e) {
      const { selectEvent, changeSelectedEvent } = this.props;
      if (!event.hidden) {
        event.hidden = true;
        selectEvent({...event});

        Array.from(document.querySelectorAll('.week-events')).map(event => {
          event.classList.add('mouse-events-off');
        });
      }

      this.mainElement.onmouseover = e => {
        let dd = e.target;
        while(true) {
          if (dd.hasAttribute('data-dd')) break;
          dd = dd.parentNode;
        }
        const date = dd.getAttribute('data-date');
        if (date) {
          this.event.dateBegin = moment(date, 'YYYY,MM,DD');
          this.event.dateEnd = moment(date, 'YYYY,MM,DD').add(event.duration, 'days');
        }

        const time = dd.getAttribute('data-time');
        if (time) {
          this.event.timeBegin = moment(time, 'HH:mm');
          const timeDifference = this.event.timeBegin - event.timeBegin;
          this.event.timeEnd = moment(parseInt(event.timeEnd.format('x')) + timeDifference);
        }
      };
      changeSelectedEvent(this.event);
    }

    eventOnDrop(event) {
      clearTimeout(this.timeout);
      document.onmousemove = null;
      window.onmouseup = null;

      if (!event.hidden) {
        this.props.eventWindowShow({
          ...event,
          dateBegin: event.dateBegin.format('YYYY-MM-DD'),
          dateEnd: event.dateEnd.format('YYYY-MM-DD')
        });
        return;
      }

      if (event.hidden) {
        const { selectedEvent, removeEventSelection, updateEvent } = this.props;
        this.mainElement.onmouseover = null;
        [...document.querySelectorAll('.month-event')].map(event => {
          event.classList.remove('mouse-events-off');
        });

        delete selectedEvent.size;
        delete selectedEvent.hidden;
        selectedEvent.dateBegin = selectedEvent.dateBegin.format('YYYY-MM-DD');
        selectedEvent.dateEnd = selectedEvent.dateEnd.format('YYYY-MM-DD');

        updateEvent(selectedEvent);
        removeEventSelection();
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          eventDragAndDrop={this.eventDragAndDrop}
        />
      );
    }
  };

  DNDComponent.propTypes = {
    selectedEvent: PropTypes.object,
    selectEvent: PropTypes.func,
    updateEvent: PropTypes.func,
    changeSelectedEvent: PropTypes.func,
    removeEventSelection: PropTypes.func,
    eventWindowShow: PropTypes.func
  };

  const mapStateToProps = state => ({
    selectedEvent: state.selected
  });

  const mapDispatchToProps = dispatch => bindActionCreators({
    selectEvent,
    updateEvent,
    changeSelectedEvent,
    removeEventSelection,
    eventWindowShow
  }, dispatch);

  return connect(mapStateToProps, mapDispatchToProps)(DNDComponent);
};

export default dragAndDrop;