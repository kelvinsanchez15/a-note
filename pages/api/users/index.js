import dbConnect from 'utils/dbConnect';
import normalizeEmail from 'validator/lib/normalizeEmail';
import User from 'models/User';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const { username, password } = req.body;
        const email = normalizeEmail(req.body.email);

        const user = new User({ username, email, password });
        await user.save();

        const token = await user.generateAuthToken();
        res.status(201).json({ success: true, data: user, token });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
