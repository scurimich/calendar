import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const eventSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true,
    validate: [textValidate, 'Invalid title'],
    maxlength: [50, 'Title must be less than 50 characters']
  },
  description: {
    type: String,
    required: false,
    default: '',
    validate: [textValidate, 'Invalid description'],
    maxlength: [200, 'Title must be less than 200 characters']
  },
  dateBegin: {
    type: String,
    required: true,
    default: new Date(),
    validate: [dateValidate, 'Invalid date']
  },
  dateEnd: {
    type: String,
    required: true,
    validate: [
      {validator: datesValidate, msg: 'Ends date must be greater than begins date'},
      {validator: dateValidate, msg: 'Invalid date'}
    ],
    default: new Date()
  },
  allDay: {
    type: Boolean,
    required: true,
    default: true
  },
  timeBegin: {
    type: String,
    default: null,
    validate: [timeRequire, 'Required']
  },
  timeEnd: {
    type: String,
    default: null,
    validate: [
      {validator: timeRequire, msg: 'Required'},
      {validator: timeEndValidate, msg: 'Ends time must be greater than begins time'}
    ]
  },
  duration: {
    type: Number,
    required: true,
    default: 0
  },
  periodic: {
    type: Boolean,
    required: true,
    default: false
  },
  week: [Boolean],
  hidden: Boolean,
  group: mongoose.Schema.Types.ObjectId,
  notification: Boolean
});

function textValidate(value) {
  return !value || value.match(/^[\wа-яА-Я.,!\?-_*\$@\s]+$/gi)[0] === value;
}

function dateValidate(value) {
  const date = value.split('-');
  const year = date[0];
  const month = date[1];
  const day = date[2];
  return (year >= 1970) && (month >= 0 && month < 12) && (day > 0 && day <  32);
}

function datesValidate(value) {
  const date = Date.parse(new Date(value));
  const begin = Date.parse(new Date(value));
  return date - begin >= 0;
}

function timeRequire(value) {
  return this.allDay || value;
}

function timeEndValidate(value) {
  if (this.allDay) return true;
  const time = +value.replace(/:/g, '');
  const begin = +this.timeBegin.replace(/:/g, '');
  return time - begin >= 0;
}

export default mongoose.model('event', eventSchema);