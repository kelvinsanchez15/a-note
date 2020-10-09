import bcrypt from 'bcrypt';
import cookie from 'cookie';
import dbConnect from 'src/utils/dbConnect';
import User from 'src/models/User';

export default async function handler(req, res) {
  const { method } = req;
  const { username, password } = req.body;

  await dbConnect();

  if (method !== 'POST') {
    res.status(400).json({ success: false });
    return;
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Unable to login');
    }

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

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
