import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;

export default (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '7 days' });
