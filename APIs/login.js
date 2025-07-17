/*
const bcrypt = require('bcrypt');

module.exports = async function login(req, res, db) {
  const { user, password } = req.body;

  const results = await db.collection('Users').find({ user }).toArray();
  let error = 'Invalid username or password';

  if (results.length > 0) {
    const u = results[0];
    const match = await bcrypt.compare(password, u.password);
    if (match) {
      // handle verified check + streak
      error = '';
      return res.status(200).json({
        id: u.id,
        name: u.name,
        email: u.email,
        rank: u.rank,
        progressW: u.progressW,
        progressY: u.progressY,
        progressO: u.progressO,
        error
      });
    }
  }

  res.status(200).json({ id: -1, name: '', email: '', error });
};
*/