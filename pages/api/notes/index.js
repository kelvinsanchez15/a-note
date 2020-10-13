import withAuth from 'src/middleware/auth';
import Note from 'src/models/Note';

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
        const { description, completed, limit, skip, sortBy } = req.query;
        const match = {
          ...(description && { description }),
          ...(completed && { completed }),
        };
        const sort = {};

        // GET /notes?sortBy=createdAt:desc || GET /notes?sortBy=updatedAt:desc
        if (sortBy) {
          const parts = sortBy.split(':');
          sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        await req.user
          .populate({ path: 'notes', match, options: { limit, skip, sort } })
          .execPopulate();
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
