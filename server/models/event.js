import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const eventSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true,
    match: [/^(\w[.,!\?-_*\$@\s]?)+$/gi, 'Invalid title'],
    maxlength: [50, 'Title must be less than 50 characters']
  },
  description: {
    type: String,
    match: [/^(\w[.,!\?-_*\$@\s]?)+$/gi, 'Invalid description'],
    maxlength: [200, 'Title must be less than 200 characters']
  },
  dateBegin: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: true,
    validate: [dateValidate, 'Ends date must be greater than begins date']
  },
  allDay: {
    type: Boolean,
    required: true,
    default: true
  },
  timeBegin: {
    type: Date,
    default: null,
    validate: [timeRequire, 'Required']
  },
  timeEnd: {
    type: Date,
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
  notification: {
    type: Boolean,
    required: true,
    default: false
  }
});

function dateValidate(value) {
  return value - this.dateBegin >= 0;
}

function timeRequire(value) {
  return this.allDay || value;
}

function timeEndValidate(value) {
  return value - this.timeBegin >= 0;
}

eventSchema.pre('save', function (next) {
  var event = this;
  next();
});

export default mongoose.model('event', eventSchema);