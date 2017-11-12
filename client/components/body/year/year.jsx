import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import classNames from 'classnames';

import { setSpace, setMiniSpace } from '../../../actions/space';
import { setView } from '../../../actions/view';

import events from '../../../hoc/events.jsx';

import { MONTH_NAMES, MONTHS_IN_YEAR, TODAY } from '../../../constants/calendar.js';

import './year.scss';

class Year extends React.Component {
  constructor(props) {
    super(props);

    this.onPrevClick = this.onArrowClick.bind(this, false);
    this.onNextClick = this.onArrowClick.bind(this, true);
  }

  onArrowClick(type) {
    const { space, setSpace } = this.props;
    type ? setSpace(space.clone().add(1, 'years')) : setSpace(space.clone().subtract(1, 'years'));
  }

  onMonthClick(val) {
    const space = moment([val.year, val.month]);
    const { setSpace, setMiniSpace, setView } = this.props;
    setSpace(space);
    setMiniSpace(space);
    setView('Month');
  }

  getEventsCount(monthInfo, events) {
    let count = 0;
    const month = moment([monthInfo.year, monthInfo.month]);
    const nextMonth = moment([monthInfo.year, monthInfo.month + 1]);
    events.map(event => {
      if ((event.dateBegin.isSameOrAfter(month)
          && event.dateBegin.isBefore(nextMonth))
        || (event.dateEnd.isSameOrAfter(month)
          && event.dateEnd.isBefore(nextMonth))) count++;
    });

    return count;
  }

  getYear() {
    const { space, date } = this.props;
    const yearNumber = space.year();
    const curYear = TODAY.year();
    const curMonth = yearNumber === curYear ? TODAY.month() : null;
    const yearArray = [];
    for (let i = 0; i < MONTHS_IN_YEAR; i++) {
      const oneMonth = {
        month: i,
        year: yearNumber,
        current: curMonth === i
      }
      yearArray.push(oneMonth);
    }
    
    return yearArray
  }

  render() {
    const { date, filterYear, space, events } = this.props;
    const filteredEvents = filterYear({events, space});
    const year = this.getYear();

    return (
      <div className="body__year year">
        <span className='year__arrow' onClick={this.onPrevClick}>
          <i className='fa fa-angle-left' aria-hidden='true'></i>
        </span>
        <ul className="year__list">
          {
            year.map((month, ndx) => {
              const eventsNumber = this.getEventsCount(month, filteredEvents);
              const number = (
                <span className='year__events'>
                  <span className='year__events-count'>{eventsNumber}</span> events.
                </span>
              );
              const empty = <span className='year__events'>No events.</span>;

              return (
                <li
                  className={classNames('year__item', {'year__item_active': month.current})}
                  key={ndx}
                  onClick={this.onMonthClick.bind(this, month)}
                >
                  <h3 className='year__title'>{MONTH_NAMES[ndx]}</h3>
                  <span className='year__full-year'>{month.year}</span>
                  {
                    eventsNumber ? number : empty
                  }
                </li>
              );
            })
          }
        </ul>
        <span className='year__arrow' onClick={this.onNextClick}>
          <i className="fa fa-angle-right" aria-hidden="true"></i>
        </span>
      </div>
    );
  }
}

Year.propTypes = {
  events: PropTypes.array,
  date: PropTypes.object,
  space: PropTypes.object,
  setView: PropTypes.func,
  setSpace: PropTypes.func,
  setMiniSpace: PropTypes.func,
  filterYear: PropTypes.func
};

const mapStateToProps = state => ({
  date: state.date,
  events: state.events,
  space: state.space.main
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setView,
  setSpace,
  setMiniSpace
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(events(Year));