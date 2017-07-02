import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const saltRounds = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^[\w-_]+@\w+.\w{2,4}$/i, 'Incorrect email']
  },
  password: {
    type: String,
    required: true,
    match: [/^(\w\s?){6,20}$/i, 'Password must be more than 6 and less than 20 characters']
  }
});

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(saltRounds, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) return next(err);

      user.password = hash;
      next();
    });
  });

});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

export default mongoose.model('user', userSchema);
