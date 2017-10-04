import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { MONTH_NAMES, MONTHS_IN_YEAR, TODAY } from '../../../constants/calendar.js';

import {
  setDate,
  setSpace,
  setMiniSpace
} from '../../../actions/space';
import { setView } from '../../../actions/view';

import './year.scss';

class Year extends React.Component {
  constructor(props) {
    super(props);
    this.onPrevClick = this.onArrowClick.bind(this, false);
    this.onNextClick = this.onArrowClick.bind(this, true);
  }

  monthClasses(month) {
    return `year__item y-month ${month.current ? 'y-month_active' : ''}`;
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

  getEventsCount(monthInfo) {
    let count = 0;
    const { events } = this.props;
    const month = moment([monthInfo.year, monthInfo.month]);
    const nextMonth = moment([monthInfo.year, monthInfo.month + 1]);
    events.map(event => {
      if ((event.dateBegin.isSameOrAfter(month)
          && event.dateBegin.isBefore(nextMonth))
        || (event.dateEnd.isSameOrAfter(month)
          && event.dateEnd.isBefore(nextMonth))) count++;
    });
    return (count > 0 ? 
      <span className='y-month__events'>
        <span className='y-month__events-count'>{count}</span> events.
      </span>
      :
      <span className='y-month__events'>There are no events.</span>
    );
  }

  getYear(date) {
    const { space } = this.props;
    const yearNumber = space.year();
    const curYear = TODAY.year();
    const curMonth = yearNumber === curYear ? TODAY.month() : null;
    const yearArray = [];
    for (let i = 0; i < MONTHS_IN_YEAR; i++) {
      const oneMonth = {
        month: i,
        year: yearNumber
      }
      yearArray[i] = oneMonth;
    }
    return yearArray.map((val, ndx) => {
      return (
        <li className={this.monthClasses(val)} key={ndx} onClick={this.onMonthClick.bind(this, val)}>
          <h3 className='y-month__title'>{MONTH_NAMES[ndx]}</h3>
          <span className='y-month__year'>{val.year}</span>
          {this.getEventsCount(val)}
        </li>
      );
    });
  }

  render() {
    const { date } = this.props;
    return (
      <div className="year">
        <span className='year__arr' onClick={this.onPrevClick}>
          <i className="fa fa-angle-left" aria-hidden="true"></i>
        </span>
        <ul className="year__list">
          {this.getYear(date)}
        </ul>
        <span className='year__arr' onClick={this.onNextClick}>
          <i className="fa fa-angle-right" aria-hidden="true"></i>
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  date: state.date,
  space: state.space.main
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setView,
  setSpace,
  setMiniSpace
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Year);