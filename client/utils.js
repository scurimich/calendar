import { DAYS_IN_WEEK, DAY, WEEKS_COUNT, MONTH_IN_YEAR } from './constants/calendar.js';
import moment from 'moment';

export function getMonthInfo(date) {
  const current = {
    number: date.month(),
    days: date.clone().add(1, 'month').date(0).date(),
    firstDay: date.clone().date(1).day() || 7,
    year: date.year()
  }
  const previous = {
    number: date.clone().subtract(1, 'month').month(),
    days: date.clone().date(0).date(),
    extraDays: current.firstDay - 1,
    year: (date.month() == (MONTH_IN_YEAR - 1) && date.year() - 1) || date.year()
  }
  return {
    current,
    previous
  };
}

export function getFirstDays(monthInfo) {
  const extraDays = monthInfo.previous.extraDays;
  const year = extraDays ? monthInfo.previous.year : monthInfo.current.year;
  const month = extraDays ? monthInfo.previous.number : monthInfo.current.number;
  const date = extraDays ? monthInfo.previous.days - (extraDays - 1) : monthInfo.current.days;
  let firstDay = moment([year, month, date]);
  const firstDays = [];
  for (let i = 0; i < WEEKS_COUNT; i++) {
    firstDays.push(firstDay);
    firstDay = firstDay.clone().add(DAYS_IN_WEEK, 'days');
  }
  return firstDays;
}

export function getWeek({ firstDay, date }) {
  const week = [];
  let oneDay = firstDay;

  for (let i = 0; i < DAYS_IN_WEEK; i++) {
    week.push({
      date: oneDay,
      currentDate: date - oneDay === 0
    });
    oneDay = oneDay.clone().add(1, 'days');
  }

  return week;
}

export function addNull(str) {
  return str.toString().length === 1 ? '0' + str : str;
}

export function sortEvents(a, b) {
  return a.dateBegin - b.dateBegin || b.duration - a.duration;
}

export function getWeekEvents(data, date, linesCount) {
  const events = [...data];
  if (!events.length) return;
  events.sort(sortEvents);
  const lines = [];
  const extra = [];
  const result = {
    lines,
    extra
  }
  let counter = 0;
  let flag = true;

  while((linesCount && counter < linesCount) || (events.length && !linesCount)) {
    let day = date;
    let size = 0;
    let currentOffset;

    for(let i = 0; i < DAYS_IN_WEEK; i += size, day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + size)) {

      const event = events.find((event, ndx) => {
        if ((i === 0 && (event.dateBegin <= day && event.dateEnd >= day)) ||
          (i !== 0 && event.dateBegin - day === 0)) {
          events.splice(ndx, 1);
          return event;
        }
      });

      if (event) {
        if (!lines[counter]) lines[counter] = [];

        if (currentOffset) {
          lines[counter].push(currentOffset);
          currentOffset = undefined;
        }

        const difference = (event.dateEnd - day) / DAY + 1;
        size = i + difference >= DAYS_IN_WEEK ? DAYS_IN_WEEK - i : difference;

        if (event.periodic) {
          const weekDay = day.getDay() ? day.getDay() : 7;
          let daysCounter = 0;
          let offsetCounter = 0;
          
          for(let i = weekDay; i < size + weekDay; i++) {
            if (event.week[i-1]) {
              if (offsetCounter) {
                lines[counter].push({size: offsetCounter, index: i});
                offsetCounter = 0;
              }
              daysCounter++;
            }
            if (!event.week[i-1]) {
              if (daysCounter) {
                lines[counter].push({...event, size: daysCounter});
                daysCounter = 0;
              } 
              offsetCounter++
            }
            if (i === (size + weekDay - 1)) {
              if (daysCounter) lines[counter].push({...event, size: daysCounter});
              if (offsetCounter) lines[counter].push({size: offsetCounter, index: i});
            }
          }
          continue;
        }

        event.size = size;
        lines[counter].push(event);
        continue;
      }

      if (!currentOffset) currentOffset = {size: 0, index: i};
      currentOffset.size++;
      size = 1;

      if (i + 1 === DAYS_IN_WEEK) {
        if (!lines[counter]) lines[counter] = [];
        lines[counter].push(currentOffset);
      }
    }
    counter++;
  }

  if (!events.length) return result;

  let day = date;
  for (let i = 0; i < DAYS_IN_WEEK; i++) {
    const currentEvents = events.filter(event => (event.dateBegin <= day && event.dateEnd >= day)).length;
    extra.push({date: day, count: currentEvents});
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  }
  return result;
}

export function serverRequest(values, address, method, token) {
  return fetch(address, {
    method: method,
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(values)
  }).then(response => Promise.all([response, response.json()]));
}