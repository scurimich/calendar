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
    match: /^(\w\s?){1,50}$/i
  },
  description: {
    type: String,
    match: /^(\w\s?){1,200}$/i
  },
  dateBegin: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    required: true
  },
  timeBegin: Date,
  timeEnd: Date,
  duration: {
    type: Number,
    required: true
  },
  periodic: {
    type: Boolean,
    required: true
  },
  days: [String],
  hidden: Boolean,
  group: mongoose.Schema.Types.ObjectId,
  notification: {
    type: Boolean,
    required: true
  },
  parent: mongoose.Schema.Types.ObjectId
});

eventSchema.pre('save', function (next) {
  var event = this;
  const dateBegin = event.dateBegin;
  const dateEnd = event.dateEnd;
  if (dateEnd - dateBegin < 0) return next(new Error('Begins date must be less than ends date'));
  next();
});

export default mongoose.model('event', eventSchema);