import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { WEEKDAYS, DAY } from '../../constants/calendar';

import './eventwindow.scss';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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
	const req = required ? (<span className='event-window__required'>*</span>) : '';
	return (
		<div className='event-window__date-cont'>
			<label className='event-window__date-label'>{label}{req}</label>
			<input className='event-window__dt-input' {...input} type={type}/>
			{touched && (error && <span className='message message_error'>{error}</span>)}
		</div>
	);
}

const inputTime = ({ input, label, type, disabled, required, meta: { touched, error } }) => {
	const req = required ? (<span className='event-window__required'>*</span>) : '';
	return (
		<div className='event-window__time-cont event-window__time-cont_left'>
			<label className='event-window__time-label'>{label}{req}</label>
			<input className='event-window__tm-input' {...input} type={type} disabled={disabled}/>
			{touched && (error && <span className='message message_error'>{error}</span>)}
		</div>
	);
}

const validate = values => {
	// console.log(values)
	const dateBegin = new Date(values.dateBegin);
	const dateEnd = new Date(values.dateEnd);
	let timeBegin;
	let timeEnd;
	if (values.timeBegin) {
		const separator = values.timeBegin.indexOf(':');
		timeBegin = new Date(1970, 0, 1, values.timeBegin.substring(0, separator), values.timeBegin.substring(separator + 1));
	}
	if (values.timeEnd) {
		const separator = values.timeEnd.indexOf(':');
		timeEnd = new Date(1970, 0, 1, values.timeEnd.substring(0, separator), values.timeEnd.substring(separator + 1));
	}
	const errors = {};

	if (!values.title) errors.title = 'Required';
	else if (values.title.length > 50) errors.title = 'Must be 50 characters or less';

	if (values.description && values.description.length > 200) errors.description = 'Must be 200 characters or less';

	if (!values.dateBegin) errors.dateBegin = 'Required';
	if (!values.dateEnd) errors.dateEnd = 'Required';
	if (dateEnd - dateBegin < 0) errors.dateEnd = 'Value must not be less than begin date';

	if (values.allDay === false && !values.timeBegin) errors.timeBegin = 'Required';
	if (values.allDay === false && !values.timeEnd) errors.timeEnd = 'Required';
	if (timeEnd - timeBegin < 0) errors.timeEnd = 'Value must not be less than begin time';
	return errors;
}



class EventWindow extends React.Component {
	constructor(props) {
		super(props);
		const { allDay, periodic, notification } = this.props.window.data;
		// console.log(this.props)
		this.state = {
			allDay: allDay,
			periodic: periodic,
			notification: notification
		};

		this.changeState = this.changeState.bind(this);
		this.submit = this.submit.bind(this);
	}

	popupClasses() {
		let classes = 'event-window'
		return this.props.window.showed ? classes += ' opened' : classes;
	}

	changeState(e) {
		const field = e.currentTarget;
		const data = {};
		data[field.name] = field.checked;
		this.setState(data);
	}

	submit(values) {
		return sleep(0)
		.then(() => {
			const {allDay, periodic, notification} = this.state;
			values = {...values, allDay, periodic, notification};
			const error = validate(values);
			if (Object.keys(error).length) throw new SubmissionError(error);
			const dateBegin = values.dateBegin;
			const dateEnd = values.dateEnd;
			const timeBegin = values.timeBegin;
			const timeEnd = values.timeEnd;
			// console.log(dateBegin, dateEnd, timeBegin, timeEnd)
			if (dateBegin) values.dateBegin = new Date(dateBegin);
			if (dateEnd) values.dateEnd = new Date(dateEnd);
			if (timeBegin) values.timeBegin = new Date(1970, 0, 1, timeBegin.substr(0, 2), timeBegin.substr(3, 2));
			if (timeEnd) values.timeEnd = new Date(1970, 0, 1, timeEnd.substr(0, 2), timeEnd.substr(3, 2));
			values.duration = (values.dateEnd - values.dateBegin) / DAY;
			this.props.sendData(values);
		});
	}

	render() {
		const { handleSubmit, onWindowClose, window, addGroup, reset } = this.props;
		const {dateBegin, dateEnd, timeBegin, timeEnd } = window.data;
		const { allDay, periodic, notification } = this.state;
		return (
			<div className={this.popupClasses()} id='event-window'>
				<div className='event-window__popup'>
					<span className='event-window__close' onClick={onWindowClose}>
						<i className="fa fa-times" aria-hidden="true"></i>
					</span>
					<h2 className='event-window__head'>Add Event</h2>
					<form className='event-window__form' onSubmit={handleSubmit(this.submit)}>
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
						<div className='event-window__days'>
							{
								WEEKDAYS.map((val, ndx) => {
									return (
										<div key={ndx}>
											<Field className='event-window__checkbox' component='input' type='checkbox' id={val} name={`week[${ndx}]`} disabled={!periodic}/>
											<label className='event-window__check-label' htmlFor={val}>{val}</label>
										</div>
									);
								})
							}
						</div>
						<h3 className='event-window__subtitle'>Groups</h3>
						<div className='event-window__groups'>
							<div className='event-window__link-cont'>
								<a href='#' className='event-window__add' onClick={addGroup}>Add Group</a>
							</div>
							<Field className='event-window__select event-window__select_groups' component='select' name='group'>
								<option value=''>Choose the group</option>
								<option value='my'>My</option>
								<option value='work'>Work</option>
								<option value='family'>Family</option>
							</Field>
						</div>
						<div className='event-window__notification'>
							<Field className='event-window__checkbox' component='input' type='checkbox' id='notification' name='notification' onClick={this.changeState} checked={notification}/>
							<label className='event-window__check-label event-window__check-label_bg' htmlFor='notification'>Notification</label>
						</div>
						<div className='event-window__control'>
							<button className='event-window__button' type='submit'>submit</button>
							<button className='event-window__button' type='button' onClick={reset}>clear</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default reduxForm({
	form: 'event',
	enableReinitialize: true,
	validate
})(EventWindow);