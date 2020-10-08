import withAuth from 'src/middleware/auth';

const handler = async (req, res) => {
  const { method } = req;

  if (method !== 'POST') {
    res.status(400).json({ success: false });
    return;
  }

  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default withAuth(handler);
