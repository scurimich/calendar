import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEvents } from '../actions/events';
import Sidebar from './sidebar/sidebar';
import Controls from './controls/controls';
import Body from './body/body';
import './app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <Sidebar />
        <div className="content">
          <Controls />
          <Body />
        </div>
      </div>
    );
  }
}