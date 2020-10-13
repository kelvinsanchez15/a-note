import withAuth from 'src/middleware/auth';
import Note from 'src/models/Note';

const handler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const note = await Note.findOne({ _id: id, owner: req.user._id });
        if (!note) {
          res.status(400).json({ success: false });
          return;
        }
        res.status(200).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PATCH':
      try {
        const note = await Note.findOne({ _id: id, owner: req.user._id });
        if (!note) {
          res.status(400).json({ success: false });
          return;
        }

        const { description, completed } = req.body;

        const updates = {
          ...(description && { description }),
          ...(completed !== null && { completed }),
        };

        Object.keys(updates).forEach((update) => {
          note[update] = updates[update];
        });

        await note.save();
        res.status(200).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const note = await Note.findOneAndDelete({
          _id: id,
          owner: req.user._id,
        });
        if (!note) {
          res.status(400).json({ success: false });
          return;
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default withAuth(handler);
