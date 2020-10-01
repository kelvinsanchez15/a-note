import dbConnect from 'utils/dbConnect';
import normalizeEmail from 'validator/lib/normalizeEmail';
import User from 'models/User';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const user = await User.findById(id);
        if (!user) {
          res.status(400).json({ success: false });
          return;
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PATCH':
      try {
        const { username, email, password } = req.body;
        const updates = {
          ...(username && { username }),
          ...(email && { email: normalizeEmail(email) }),
          ...(password && { password }),
        };

        const user = await User.findById(id);

        Object.keys(updates).forEach((update) => {
          user[update] = updates[update];
        });

        await user.save();
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
