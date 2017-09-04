import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {MONTH_NAMES, MONTH_IN_YEAR, TODAY} from '../../../constants/calendar.js';

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
    type ? setSpace(new Date(`${space.getFullYear() + 1}`)) : setSpace(new Date(`${space.getFullYear() - 1}`));
  }

  onMonthClick(val) {
    const space = new Date(val.year, val.month);
    const { setSpace, setMiniSpace, setView } = this.props;
    setSpace(space);
    setMiniSpace(space);
    setView('Month');
  }

  getEventsCount(monthInfo) {
    let count = 0;
    const { events } = this.props;
    const month = new Date(monthInfo.year, monthInfo.month);
    const nextMonth = new Date(monthInfo.year, monthInfo.month + 1);
    events.map(event => {
      if ((event.dateBegin - month >= 0 
          && event.dateBegin - nextMonth < 0) 
        || (event.dateEnd - month >= 0 
          && event.dateEnd - nextMonth < 0)) count++;
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
    const yearNumber = space.getFullYear();
    const curYear = TODAY.getFullYear();
    const curMonth = yearNumber === curYear ? TODAY.getMonth() : null;
    const yearArray = [];
    for (let i = 0; i < MONTH_IN_YEAR; i++) {
      const oneMonth = {
        number: new Date(yearNumber, i + 1, 0).getDate(),
        title: MONTH_NAMES[i],
        current: curMonth === i,
        month: i,
        year: yearNumber
      }
      yearArray[i] = oneMonth;
    }
    return yearArray.map((val, ndx) => {
      return (
        <li className={this.monthClasses(val)} key={ndx} onClick={this.onMonthClick.bind(this, val)}>
          <h3 className='y-month__title'>{val.title}</h3>
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