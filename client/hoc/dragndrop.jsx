import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectEvent, changeSelectedEvent, removeEventSelection } from '../actions/selectedevent.js';
import { updateEvent } from '../actions/events.js';
import { eventWindowShow } from '../actions/eventwindow.js';


const dragAndDrop = (Component) => {

  class dndComponent extends React.Component {
    constructor(props) {
      super(props);
      this.eventDragAndDrop = this.eventDragAndDrop.bind(this);
      this.event = {};
    }

    eventDragAndDrop(e) {
      e.preventDefault();
      const { events, selectedEvent } = this.props;
      const element = e.target;
      const event = selectedEvent || events.find(event => event._id === element.id);
      const baseElement = document.querySelector('[data-dd]');
      this.mainElement = document.querySelector('.body [class*="_main"]');

      window.onmouseup = this.eventOnDrop.bind(this, event);
      this.timeout = setTimeout(function() {
        document.onmousemove = this.eventOnMove.bind(this, element, event);
      }.bind(this), 50);
    }

    eventOnMove(element, event, e) {
      const { selectEvent, changeSelectedEvent } = this.props;
      if (!event.hidden) {
        event.hidden = true;
        selectEvent(event);

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
          this.event.dateBegin = new Date(date);
          this.event.dateEnd = new Date(new Date(date).setDate(this.event.dateBegin.getDate() + event.duration));
        }

        const time = dd.getAttribute('data-time');
        if (time) {
          this.event.timeBegin = new Date(time);
          const timeDifference = this.event.timeBegin - event.timeBegin;
          this.event.timeEnd = new Date(Date.parse(event.timeEnd) + timeDifference);
        }
      };

      changeSelectedEvent(this.event);
    }

    eventOnDrop(event) {
      clearTimeout(this.timeout);
      document.onmousemove = null;
      window.onmouseup = null;

      if (!event.hidden) {
        this.props.eventWindowShow(event);
        return;
      }

      if (event.hidden) {
        const { selectedEvent, removeEventSelection, updateEvent } = this.props;
        this.mainElement.onmouseover = null;
        Array.from(document.querySelectorAll('.week-events')).map(event => {
          event.classList.remove('mouse-events-off');
        });

        delete selectedEvent.size;
        delete selectedEvent.hidden;
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

  return connect(mapStateToProps, mapDispatchToProps)(dndComponent);
};

export default dragAndDrop;