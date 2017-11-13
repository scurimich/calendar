import mongoose from 'mongoose';

const groupSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true,
    match: /^([\wа-яА-Я]\s?){1,20}$/i
  },
  color: {
    type: String,
    default: '#000000',
    match: /^#(\d?[a-f]?){6}$/i
  }
});



export default mongoose.model('group', groupSchema);