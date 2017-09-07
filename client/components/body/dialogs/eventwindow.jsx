import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import Select from 'react-select';
import { WEEKDAYS, DAY, DAYS_IN_WEEK, WEEK } from '../../../constants/calendar.js';
import { addNull } from '../../../utils.js';

import 'react-select/dist/react-select.css';
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
	if (typeof input.value === 'object') input.value = `${input.value.getFullYear()}-${addNull(input.value.getMonth() + 1)}-${addNull(input.value.getDate())}`;
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
	if (typeof input.value === 'object') input.value = `${addNull(input.value.getHours())}:${addNull(input.value.getMinutes())}`;
	const req = required ? (<span className='event-window__required'>*</span>) : '';
	return (
		<div className='event-window__time-cont event-window__time-cont_left'>
			<label className='event-window__time-label'>{label}{req}</label>
			<input className='event-window__tm-input' {...input} type={type} disabled={disabled}/>
			{touched && (error && <span className='message message_error'>{error}</span>)}
		</div>
	);
};

const periodicField = ({ input, type, disabled, required, meta: { touched, error } }) => {
	return (
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
};

const validate = values => {
	const dateBegin = new Date(values.dateBegin);
	const dateEnd = new Date(values.dateEnd);

	let timeBegin = values.timeBegin;
	let timeEnd = values.timeBEnd;

	const errors = {};

	if (!values.title) errors.title = 'Required';
	else if (values.title.length > 50) errors.title = 'Must be 50 characters or less';

	if (values.description && values.description.length > 200) errors.description = 'Must be 200 characters or less';

	if (!values.dateBegin) errors.dateBegin = 'Required';
	if (!values.dateEnd) errors.dateEnd = 'Required';
	if (dateEnd - dateBegin < 0) errors.dateEnd = 'Value must not be less than begin date';

	if (values.timeBegin && typeof values.timeBegin === 'string') {
		const separator = values.timeBegin.indexOf(':');
		timeBegin = new Date(1970, 0, 1, values.timeBegin.substring(0, separator), values.timeBegin.substring(separator + 1));
	}
	if (values.timeEnd && typeof values.timeEnd === 'string') {
		const separator = values.timeEnd.indexOf(':');
		timeEnd = new Date(1970, 0, 1, values.timeEnd.substring(0, separator), values.timeEnd.substring(separator + 1));
	}

	if (values.allDay === false && !values.timeBegin) errors.timeBegin = 'Required';
	if (values.allDay === false && !values.timeEnd) errors.timeEnd = 'Required';
	if (timeEnd - timeBegin < 0) errors.timeEnd = 'Value must not be less than begin time';
	if (values.periodic && values.week && (Date.parse(dateBegin) + WEEK - Date.parse(dateEnd) > 0)) {
		let daysCounter;
		for (let i = dateBegin; i <= dateEnd; i.setDate(i.getDate() + 1)) {
			const day = i.getDay() - 1;
			daysCounter = daysCounter || values.week[day];
		}
		if (!daysCounter) errors.week = 'There aren\'t any days with events';
	}
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

	popupClasses() {
		const { showed } = this.props.eventWindow;
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
				value={(input.value) || ''}
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
			<div className={this.popupClasses()} id='event-window'>
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

export default connect(state => ({initialValues: state.eventWindow.data}), null)(reduxForm({
	form: 'event',
	enableReinitialize: true,
	validate
})(EventWindow));
