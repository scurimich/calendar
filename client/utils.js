import { DAYS_IN_WEEK, DAY, NUMBER_OF_WEEKS, MONTH_IN_YEAR } from './constants/calendar.js';
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

export function sortEvents(a, b) {
  return a.dateBegin - b.dateBegin || b.duration - a.duration;
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