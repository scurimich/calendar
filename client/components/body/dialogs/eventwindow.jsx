import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import moment from 'moment';
import Select from 'react-select';

import { WEEKDAYS } from '../../../constants/calendar.js';

import './eventwindow.scss';

const inputText = ({ input, label, type, required, meta: { touched, error } }) => {
	const req = required ? (<span className='event-window__required'>*</span>) : '';

	return (
		<label className='event-window__text-label'>{label}{req}
			<input className='event-window__txt-input' {...input} placeholder={label} type={type} />
			{touched && (error && <span className='message message_error'>{error}</span>)}
		</label>
	)
};

const inputDate = ({ input, label, type, required, meta: { touched, error } }) => {
	if (typeof input.value === 'object') input.value = moment(input.value).format('YYYY-MM-D');
	const req = required ? (<span className='event-window__required'>*</span>) : '';

	return (
		<div className='event-window__date-cont'>
			<label className='event-window__date-label'>{label}{req}</label>
			<input className='event-window__dt-input' {...input} type={type}/>
			{touched && (error && <span className='message message_error'>{error}</span>)}
		</div>
	);
};

const inputTime = ({ input, label, type, disabled, required, meta: { touched, error } }) => {
	if (typeof input.value === 'object') input.value = input.value.format('HH:mm');
	const req = required ? (<span className='event-window__required'>*</span>) : '';

	return (
		<div className='event-window__time-cont event-window__time-cont_left'>
			<label className='event-window__time-label'>{label}{req}</label>
			<input className='event-window__tm-input' {...input} type={type} disabled={disabled}/>
			{touched && (error && <span className='message message_error'>{error}</span>)}
		</div>
	);
};

const periodicField = ({ input, type, disabled, required, meta: { touched, error } }) => (
	<div className='event-window__days'>
		{
			WEEKDAYS.map((val, ndx) => {
				return (
					<div key={ndx}>
						<Field className='event-window__checkbox' component='input' type={type} id={val} name={`${input.name}[${ndx}]`} disabled={disabled}/>
						<label className='event-window__check-label' htmlFor={val}>{val}</label>
					</div>
				);
			})
		}
		{error && <span className='message message_error'>{error}</span>}
	</div>
);

const validate = values => {
	const errors = {};
	const dateBegin = moment(values.dateBegin);
	const dateEnd = moment(values.dateEnd);
	const timeBegin = moment(values.timeBegin, 'HH:mm');
	const timeEnd = moment(values.timeEnd, 'HH:mm');

	if (!values.title) errors.title = 'Required';
	else if (values.title.length > 50) errors.title = 'Must be 50 characters or less';

	if (values.description && values.description.length > 200) errors.description = 'Must be 200 characters or less';

	if (!values.dateBegin) errors.dateBegin = 'Required';
	if (!values.dateEnd) errors.dateEnd = 'Required';
	if (dateEnd.isBefore(dateBegin)) errors.dateEnd = 'Value must not be less than begin date';

	if (timeEnd.isBefore(timeBegin)) errors.timeEnd = 'Value must not be less than begin time';

	if (values.allDay === false && !values.timeBegin) errors.timeBegin = 'Required';
	if (values.allDay === false && !values.timeEnd) errors.timeEnd = 'Required';

	if (values.periodic && values.week && (dateBegin.clone().add(1, 'weeks').isAfter(dateEnd))) {
		let daysCounter;
		for (let i = dateBegin; i.isSameOrBefore(dateEnd); i.add(1, 'days')) {
			const day = i.day() - 1;
			daysCounter = daysCounter || values.week[day];
		}
		if (!daysCounter) errors.week = 'There aren\'t any days with events';
	}
	if (typeof values.group === 'string')
		values.group = groups.find(group => group._id === values.group);

	return errors;
}

class EventWindow extends React.Component {
	constructor(props) {
		super(props);

		this.changeState = this.changeState.bind(this);
		this.selectRender = this.selectRender.bind(this);
		this.selectLabelRender = this.selectLabelRender.bind(this);
		this.selectGroup = this.selectGroup.bind(this);
	}

	active() {
		const { showed, resetForm } = this.props.eventWindow;
		let classes = 'event-window';
		return showed ? classes += ' opened' : classes;
	}

	changeState(e) {
		const { eventWindowShow } = this.props;
		const field = e.currentTarget;
		const data = {};
		data[field.name] = field.checked;
		eventWindowShow(data)
	}

	selectRender({ label, value, color }) {
		return (
			<div className='group-select__option'>
				<span className='group-select__color' style={ {backgroundColor: color} }></span>
				<span className='group-select__text'>{label}</span>
			</div>
		);
	}

	selectLabelRender({ color, label }) {
		return (
			<div className='group-select__label'>
				<span className='group-select__color' style={ {backgroundColor: color} }></span>
				<span className='group-select__text'>{label}</span>
			</div>
		);
	}

	selectGroup({ input, options, optionRenderer, valueRenderer }) {
		const { groups } = this.props;
		if (typeof input.value === 'string') input.value = groups.find(group => group._id === input.value);
		return (
			<Select
				{...input}
				className='event-window__select event-window__select_groups group-select'
				placeholder='Select type(group) of event'
				searchable={false}
				clearable={true}
				options={options}
				optionRenderer={optionRenderer}
				valueRenderer={valueRenderer}
				value={input.value || ''}
			/>
		);
	}

	render() {
		const { handleSubmit, onWindowClose, eventWindow, addGroup, addEvent, updateEvent,  groups, initialValues } = this.props;
		const { dateBegin, dateEnd, timeBegin, timeEnd } = eventWindow.data;
		const { allDay, periodic, notification } = initialValues;
		const id = initialValues._id;
		const submit = id ? updateEvent : addEvent;

		return (
			<div className={this.active()} id='event-window'>
				<div className='event-window__popup'>
					<span className='event-window__close' onClick={onWindowClose}>
						<i className="fa fa-times" aria-hidden="true"></i>
					</span>
					<h2 className='event-window__head'>{id ? 'Update' : 'Add'} event</h2>
					<form className='event-window__form' onSubmit={handleSubmit(submit.bind(this))}>
						<Field component={inputText} type='text' name='title' label='Event title' required={true}/>
						<Field component={inputText} type='text' name='description' label='Event description' required={false}/>
						<h3 className='event-window__subtitle'>Dates</h3>
						<div className='event-window__dates'>
							<Field component={inputDate} type='date' name='dateBegin' label='Begin:' value={dateBegin} required={true}/>
							<Field component={inputDate} type='date' name='dateEnd' label='End:' value={dateEnd} required={true}/>
						</div>
						<h3 className='event-window__subtitle'>Time</h3>
						<div className='event-window__all-day'>
							<Field className='event-window__checkbox' component='input' type='checkbox' id='all-day' name='allDay' value='allday' onClick={this.changeState} checked={allDay}/>
							<label className='event-window__check-label event-window__check-label_bg' htmlFor='all-day'>All day</label>
						</div>
						<div className='event-window__time'>
							<Field component={inputTime} type='time' name='timeBegin' label='Begin:' disabled={allDay} required={!allDay}/>
							<Field component={inputTime} type='time' name='timeEnd' label='End:' disabled={allDay} required={!allDay}/>
						</div>
						<h3 className='event-window__subtitle'>Days of the Week</h3>
						<div className='event-window__repeat'>
							<Field className='event-window__checkbox' component='input' type='checkbox' id='periodic' name='periodic' value='periodic' onClick={this.changeState} checked={periodic}/>
							<label className='event-window__check-label event-window__check-label_bg' htmlFor='periodic'>Repeating</label>
						</div>
						<Field component={periodicField} type='checkbox' name='week' disabled={!periodic}/>
						<h3 className='event-window__subtitle'>Groups</h3>
						<div className='event-window__groups'>
							<div className='event-window__link-cont'>
								<a className='event-window__add' onClick={addGroup}>Add Group</a>
							</div>
							<Field
								name='group'
								component={this.selectGroup}
								options={groups}
								optionRenderer={this.selectRender}
								valueRenderer={this.selectLabelRender}
								resetVal={this.selectClear}
							/>
						</div>
						<div className='event-window__notification'>
							<Field className='event-window__checkbox' component='input' type='checkbox' id='notification' name='notification' onClick={this.changeState} checked={notification}/>
							<label className='event-window__check-label event-window__check-label_bg' htmlFor='notification'>Notification</label>
						</div>
						<div className='event-window__control'>
							<button className='event-window__button' type='submit'>submit</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

EventWindow.propTypes = {
	addEvent: PropTypes.func,
	updateEvent: PropTypes.func,
	eventWindow: PropTypes.object,
	onWindowClose: PropTypes.func,
	addGroup: PropTypes.func,
	groups: PropTypes.array,
	eventWindowShow: PropTypes.func
};

const mapStateToProps = state => {
	const group = state.groups.find(group => group._id === state.eventWindow.data.group);
	return {
		initialValues: {...state.eventWindow.data, group}
	};
};

export default connect(mapStateToProps, null)(reduxForm({
	form: 'event',
	enableReinitialize: true,
	keepDirtyOnReinitialize: true,
	validate
})(EventWindow));