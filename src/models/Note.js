import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please provide a description for this note.'],
      maxlength: [60, 'Description cannot be more than 60 characters'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
