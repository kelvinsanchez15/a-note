import cookie from 'cookie';
import dbConnect from 'src/utils/dbConnect';
import normalizeEmail from 'validator/lib/normalizeEmail';
import User from 'src/models/User';

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

        res.setHeader(
          'Set-Cookie',
          cookie.serialize('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 3600 * 24 * 7,
            path: '/',
          })
        );

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
