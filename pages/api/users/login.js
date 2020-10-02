import dbConnect from 'utils/dbConnect';
import User from 'models/User';

export default async function handler(req, res) {
  const { method } = req;
  const { username, password } = req.body;

  // console.log(req.body);

  await dbConnect();

  if (method !== 'POST') {
    res.status(400).json({ success: false });
    return;
  }

  try {
    const user = await User.findByCredentials({ username, password });
    // const user = await User.findOne({ username });
    console.log(user);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
