import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a name.'],
      unique: true,
      maxlength: [36, 'Username cannot be more than 36 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email.'],
      unique: true,
      maxlength: [320, 'Email address cannot be more than 320 characters'],
      trim: true,
      validate: [isEmail, 'Invalid Email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      maxlength: [254, 'Password cannot be more than 254 characters'],
      trim: true,
    },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} has already been used.',
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
