import React from 'react';

import { DAYS_IN_WEEK, DAY, TODAY } from '../constants/calendar.js';

const events = (Component) => {
  return class EventsComponent extends React.Component {
    constructor(props) {
      super(props)

      this.sortDateDuration = this.sortDateDuration.bind(this);
      this.getWeekLines = this.getWeekLines.bind(this);
      this.setEventsSizes = this.setEventsSizes.bind(this);
    }

    filterYear({events, space}) {
      return events.filter(event => {
        return (event.dateBegin.year() === space.year()
            || event.dateEnd.year() === space.year());
      });
    }

    filterWeek({events, weekBegin}) {
      const weekEnd = weekBegin.clone().add(6, 'days');
      return events.filter(event => {
        return (event.dateBegin.isSameOrAfter(weekBegin) && event.dateBegin.isSameOrBefore(weekEnd))
          || (event.dateEnd.isSameOrAfter(weekBegin) && event.dateEnd.isSameOrBefore(weekEnd))
          || (event.dateBegin.isSameOrBefore(weekBegin) && event.dateEnd.isSameOrAfter(weekEnd));
      });
    }

    filterDate({events, date}) {
      const day = !date.day() ? 6 : date.day() - 1;
      return events.filter(event => (
        event.dateBegin.isSame(date)
        || (event.dateBegin.isSameOrBefore(date) && event.dateEnd.isSameOrAfter(date))
        && (event.periodic | event.week[day] : true)
      ));
    }

    filterDays(events) {
      return events.filter(event => event.duration > 0 || event.allDay);
    }

    filterDay({events, date}) {
      return events.filter(event => (
        !event.allDay
        && event.duration === 0
        && (event.dateBegin.isSame(date)))
      );
    }

    filterAllDay(events) {
      return events.filter(event => event.allDay);
    }

    filterTime(events) {
      return events.filter(event => event.timeBegin && event.timeEnd);
    }

    sortDateDuration(a, b) {
      return a.dateBegin - b.dateBegin || b.duration - a.duration;
    }

    sortTimeBeginEnd(a, b) {
      return a.timeBegin - b.timeBegin || b.timeEnd - a.timeEnd;
    }

    getWeekLines({data, date, linesCount}) {
      const events = [...data];
      if (!events.length) return;
      events.sort(this.sortDateDuration);
      const lines = [];
      const extra = [];
      const result = {
        lines,
        extra
      }
      let counter = 0;
      let flag = true;

      while((linesCount && counter <= linesCount) || (events.length && !linesCount)) {
        let day = date.clone();
        let size = 0;
        let currentOffset;

        for(let i = 0; i < DAYS_IN_WEEK; i += size, day.add(size, 'days')) {

          const event = events.find((event, ndx) => {
            if ((i === 0 && (event.dateBegin.isSameOrBefore(day) && event.dateEnd.isSameOrAfter(day))) ||
              (i !== 0 && event.dateBegin.isSame(day))) {
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
              const weekDay = day.day() ? day.day() : 7;
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

      let day = date.clone();
      for (let i = 0; i < DAYS_IN_WEEK; i++) {
        const currentEvents = events.filter(event => (event.dateBegin.isSameOrBefore(day) && event.dateEnd.isSameOrAfter(day))).length;
        extra.push({date: day.clone(), count: currentEvents});
        day.add(1, 'days');
      }

      return result;
    }

    setEventsSizes(events) {
      const { sortTimeBeginEnd } = this;
      let groups = [];
      return events.sort(sortTimeBeginEnd)
        .reduce((result, item, ndx, arr) => {
          const event = {...item};
          if (ndx === 0) {
            groups.push(event.timeEnd);
            event.horizontal = 0;
            result.push(event);
            return result;
          }

          const find = groups.find((groupTime, groupNdx, groupArr) => {
            if (event.timeBegin.isSameOrAfter(groupTime)) {
              event.horizontal = groupNdx;
              if (groupNdx === 0) {
                const find = groupArr.find(val => {
                  return event.timeBegin.isBefore(val);
                });
                if (!find) {
                  result.push(event);
                  result.map(resEvent => {
                    if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
                    return resEvent;
                  });
                  groups = [event.timeEnd];
                  return true;
                }
              }
              groupArr[groupNdx] = Math.max(groupArr[groupNdx], event.timeEnd);
              result.push(event);
              if (ndx === arr.length - 1) {
                result.map(resEvent => {
                  if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
                  return resEvent;
                });
              }
              return true;
            }
            if (groupNdx === groupArr.length - 1) {
              event.horizontal = groupNdx + 1;
              groupArr.push(event.timeEnd);
              result.push(event);
              if (ndx === arr.length - 1) {
                result.map(resEvent => {
                  if (!resEvent.horizontalSize) resEvent.horizontalSize = groupArr.length;
                  return resEvent;
                });
              }
              return true;
            }
          });

          return result;
        }, []);
    }

    setEventsPositions(events) {
      const minutes = 60;
      const seconds = 60;
      const milliseconds = 1000;
      const percentages = 100;

      return events.map(event => {
        const result = {...event};
        result.timeDifference = event.timeEnd - event.timeBegin;
        result.height = (result.timeDifference / milliseconds / seconds / minutes) * percentages;
        result.top = event.timeBegin.minutes() / minutes * percentages;
        result.position = event.horizontal;
        result.horizontalSize = event.horizontalSize || 1;
        result.onePiece = percentages / result.horizontalSize;
        result.width = result.position !== result.horizontalSize - 1 ? result.onePiece * 1.5 : result.onePiece;
        result.left = result.onePiece * result.position;
        result.zIndex = result.position + 1;
        result.color = event.group && event.group.length && event.group.color;
        
        return result;
      });
    }

    render() {
      const {
        getWeekLines,
        filterYear,
        filterWeek,
        filterDate,
        filterDays,
        filterAllDay,
        filterDay,
        filterTime,
        sortTimeBeginEnd,
        setEventsSizes,
        setEventsPositions
      } = this;

      return (
        <Component
          {...this.props}
          getWeekLines={getWeekLines}
          filterYear={filterYear}
          filterWeek={filterWeek}
          filterDate={filterDate}
          filterDays={filterDays}
          filterAllDay={filterAllDay}
          filterDay={filterDay}
          filterTime={filterTime}
          sortTimeBeginEnd={sortTimeBeginEnd}
          setEventsSizes={setEventsSizes}
          setEventsPositions={setEventsPositions}
        />
      );
    }
  }
}

export default events;