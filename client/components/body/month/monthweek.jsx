import React from 'react';
import MonthDay from './monthday';
import MonthEvents from './monthevents';
import { DAYS_IN_WEEK, TODAY } from '../../../constants/calendar';
import { addNull } from '../../../utils';

export default class MonthWeek extends React.Component {
  constructor(props) {
    super(props);
  }

  getWeek() {
    const { firstDay, activeDate, prevDays, curNumber, selectedEvent } = this.props;
    const week = [];
    const year = firstDay.getFullYear();
    const month = firstDay.getMonth();
    const day = firstDay.getDay() == 0 ? 6 : firstDay.getDay() - 1;
    let oneDay = day == 1 ? firstDay
      : new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() - day);

    for (let i = 1; i <= DAYS_IN_WEEK; oneDay = new Date(oneDay.getFullYear(), oneDay.getMonth(), oneDay.getDate() + 1), i++) {
      const currentYear = oneDay.getFullYear();
      const currentMonth = addNull(oneDay.getMonth() + 1);
      const currentDate = addNull(oneDay.getDate());
      let currentDay = `${currentYear},${currentMonth},${currentDate}`;

      week.push({
        date: oneDay,
        id: currentDay,
        current: !Boolean(activeDate - oneDay),
        today: !Boolean(TODAY - oneDay),
        hover: selectedEvent ?
          Boolean(oneDay >= selectedEvent.newDateBegin
            && selectedEvent.newDateEnd> oneDay)
          : null,
        onDateClick: this.onDateClick.bind(this, oneDay),
        onAddClick: this.onAddClick.bind(this, oneDay),
        onDayClick: this.onDayClick.bind(this, oneDay)
      });
    }
    return week;
  }

  onAddClick(date) {
    const { eventWindowShow } = this.props;
    const data = {
      dateBegin: date,
      dateEnd: date
    };
    eventWindowShow(data);
  }

  onDayClick(date, e) {
    if (e.target.id === 'add-event' || e.target.id === 'day-date') return;
    const {setDate} = this.props;
    setDate(date);
  }

  onDateClick(date) {
    const { setView, setSpace, setMiniSpace } = this.props;
    setView('Day');
    setSpace(date);
    setMiniSpace(date);
  }

  render() {
    const {
      firstDay,
      events,
      weekNdx,
      selectedEvent,
      changeSelectedEvent,
      changeEvent,
      eventDragAndDrop
    } = this.props;
    return (
      <li className='month__item' onClick={this.onWeekClick}>
        <MonthEvents
          date={firstDay}
          events={events}
          ndx={weekNdx}
          selectedEvent={selectedEvent}
          changeSelectedEvent={changeSelectedEvent}
          changeEvent={changeEvent}
          eventDragAndDrop={eventDragAndDrop}
        />
        <ul className='month__week'>
          {
            this.getWeek().map((day, dayNdx) => {
              return (<MonthDay
                {...day}
                key={dayNdx}
              />);
            })
          }
        </ul>
      </li>
    );
  }
}