import React from 'react';

const dragAndDrop = (Component, options) => {
  // console.log(options);

  class dndComponent extends React.Component {
    constructor(props) {
      super(props);
      // console.log(props)
    }

    eventDragAndDrop(e) {
      e.preventDefault();
      const { events } = this.props;
      const baseElement = document.querySelector('[data-dd]')
      // const baseElementWidth = baseElement.offsetWidth;
      const element = e.currentTarget;
      const elementHeight = element.offsetHeight;

      document.onmousemove = this.eventOnMove.bind(this, element, elementHeight, event);
      window.onmouseup = this.eventOnDrop.bind(this, event);
    }

    eventOnMove(element, elementHeight, event, e) {
      if (!event.hidden) {
        const { changeEvent } = this.props;
        event.hidden = true;
        changeEvent(event);

        this.newElement = element.cloneNode(true);
        this.newElement = className = 'week-events__item week-events__item_absolute';
        this.newElement = classList.add('mouse-events-off');
        Array.from(document.querySelectorAll('.week-events')).map(event => {
          event.classList.add('mouse-events-off');
        });
        // this.newElement.style.width = `${baseElementWidth}px`;
        // this.newElement.style.height = `${elementHeight}px`;

        document.body.appendChild(this.newElement);
      }

      document.querySelector('.body [class*="_main"]').onmouseover = e => {
        let dd = e.target;
        while(true) {
          if (dd.hasAttribute('data-dd')) break;
          dd = dd.parentNode;
        }
        const date = dd.getAttribute('data-date');
        const time = dd.getAttribute('data-time');
        if (date) this.newDateBegin = new Date(date);
        if (time) this.newTimeBegin = new Date(time);
      };

      this.eventMove(e, this.newElement);
      const { selectEvent } = this.props;
      selectEvent({
        id: event.id,
        duration: event.duration,
        newDateBegin: this.newDateBegin,
        newTimeBegin: this.newTimeBegin
      });
    }

    eventOnDrop(event) {
      document.onmousemove = null;
      window.onmouseup = null;

      if (!this.newElement) {
        this.props.onEventClick();
        return;
      }

      if (event.hidden) {

        document.querySelector('.body [class*="__main"]').onmouseover = null;
        Array.from(document.querySelectorAll('.week-events')).map(event => {
          event.classList.remove('mouse-events-off');
        });
        this.newElement.classList.remove('mouse-events-off');
        this.newElement.remove();
        delete this.newElement;

        event.hidden = false;

        const selected = this.props.selectedEvent;
        let dateDifference = selected.newDateBegin - event.dateBegin;
        let timeDifference = selected.newTimeBegin - event.timeBegin;

        dateDifference /= DAY;
        timeDifference /= 60000;
        for(let key in event) {
          if (key.indexOf('date') + 1 && dateDifference !== 0 && !isNaN(dateDifference)) {
            const date = event[key];
            event[key] = new Date(date.getFullYear(), date.getMonth(), date.getDate() + dateDifference);
          }
          if (key.indexOf('time') + 1 && timeDifference !== 0 && !isNaN(timeDifference)) {
            const time = event[key];
            event[key] = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes() + timeDifference);
          }
        }

        this.props.changeEvent(event);
        this.props.changeSelectedEvent(null);
      }
    }

    eventMove() {
      element.style.left = `${e.pageX - element.offsetWidth / 2}px`;
      element.style.top = `${e.pageY - element.offsetHeight / 2}px`;
    }

    render() {
      return <Component {...this.props} />
    }
  };

  return dndComponent;
};

export default dragAndDrop;