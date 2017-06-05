import mongoose from 'mongoose';

const groupSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    match: /^(\w\s?){1,20}$/i
  },
  color: {
    type: String,
    default: '#000000',
    match: /^#(\d?[a-f]?){6}$/i
  }
});



export default mongoose.model('group', groupSchema);