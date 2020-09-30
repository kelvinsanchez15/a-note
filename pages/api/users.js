import dbConnect from 'utils/dbConnect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

import User from 'models/User';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({}).select(['username']);
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const { username, password } = req.body;
        const email = normalizeEmail(req.body.email);
        if (!isEmail(email)) {
          res
            .status(400)
            .json({
              success: false,
              error: 'The email you entered is invalid.',
            });
          return;
        }

        const user = await User.create({ username, email, password });
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
