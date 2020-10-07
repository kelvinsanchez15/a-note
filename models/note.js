import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this note.'],
      maxlength: [60, 'Title cannot be more than 60 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this note.'],
      maxlength: [250, 'Description cannot be more than 250 characters'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
