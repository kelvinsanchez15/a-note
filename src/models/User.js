import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import Note from 'src/models/Note';

const jwt = jsonwebtoken;

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
    profileImage: {
      type: String,
    },
    tokens: [String],
  },
  { timestamps: true }
);

UserSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'owner',
});

// Hide sensitive data on JSON responses
UserSchema.methods.toJSON = function toJSON() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.set('toObject', { virtuals: true });

UserSchema.methods.generateAuthToken = async function generateAuthToken() {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '7 days',
  });
  user.tokens.push(token);

  await user.save();
  return token;
};

UserSchema.pre('save', async function hashPassword(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

UserSchema.pre('remove', async function deleteUserNotes(next) {
  const user = this;
  await Note.deleteMany({ owner: user._id });
  next();
});

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} has already been used.',
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
