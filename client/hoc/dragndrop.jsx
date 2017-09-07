import React from 'react';

const dragAndDrop = (Component, options) => {
  // console.log(options);

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
      const baseElement = document.querySelector('[data-dd]')
      // const baseElementWidth = baseElement.offsetWidth;
      // const elementHeight = element.offsetHeight;

      document.onmousemove = this.eventOnMove.bind(this, element, event);
      window.onmouseup = this.eventOnDrop.bind(this, event);
    }

    eventOnMove(element, event, e) {
      const { selectEvent, changeSelectedEvent } = this.props;
      if (!event.hidden) {
        event.hidden = true;
        selectEvent(event);

        this.newElement = element.cloneNode(true);
        this.newElement.className = 'week-events__item week-events__item_absolute mouse-events-off';
        Array.from(document.querySelectorAll('.week-events')).map(event => {
          event.classList.add('mouse-events-off');
        });

        document.body.appendChild(this.newElement);
      }

      document.querySelector('.body [class*="_main"]').onmouseover = e => {
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

        // const time = dd.getAttribute('data-time');
        // if (time) this.newTimeBegin = new Date(time);
      };

      changeSelectedEvent(this.event);
      this.eventMove(this.newElement, e);
    }

    eventOnDrop(event) {
      document.onmousemove = null;
      window.onmouseup = null;

      if (!this.newElement) {
        this.props.onEventClick(event);
        return;
      }

      if (event.hidden) {
        const { selectedEvent, removeEventSelection, updateEvent } = this.props;
        document.querySelector('.body [class*="__main"]').onmouseover = null;
        Array.from(document.querySelectorAll('.week-events')).map(event => {
          event.classList.remove('mouse-events-off');
        });
        this.newElement.remove();
        delete this.newElement;

        // let dateDifference = selectedEvent.newDateBegin - event.dateBegin;
        // let timeDifference = selectedEvent.newTimeBegin - event.timeBegin;

      //   dateDifference /= DAY;
      //   timeDifference /= 60000;
      //   for(let key in event) {
      //     if (key.indexOf('date') + 1 && dateDifference !== 0 && !isNaN(dateDifference)) {
      //       const date = event[key];
      //       event[key] = new Date(date.getFullYear(), date.getMonth(), date.getDate() + dateDifference);
      //     }
      //     if (key.indexOf('time') + 1 && timeDifference !== 0 && !isNaN(timeDifference)) {
      //       const time = event[key];
      //       event[key] = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes() + timeDifference);
      //     }
      //   }
        console.log(selectedEvent)
        delete selectedEvent.size;
        delete selectedEvent.hidden;
        updateEvent(selectedEvent);
        removeEventSelection();
      }
    }

    eventMove(element, e) {
      element.style.left = `${e.pageX - element.offsetWidth / 2}px`;
      element.style.top = `${e.pageY - element.offsetHeight / 2}px`;
    }

    render() {
      return <Component
        {...this.props}
        eventDragAndDrop={this.eventDragAndDrop}
        />
    }
  };

  return dndComponent;
};

export default dragAndDrop;