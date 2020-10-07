import withAuth from 'middleware/auth';
import Note from 'models/Note';

const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const note = new Note({ ...req.body, owner: req.user._id });
        await note.save();
        res.status(201).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'GET':
      try {
        await req.user.populate('notes').execPopulate();
        res.status(200).json({ success: true, data: req.user.notes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default withAuth(handler);
