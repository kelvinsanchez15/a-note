import withAuth from 'utils/auth';

const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        res.status(200).json({ success: true, data: req.user });
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
