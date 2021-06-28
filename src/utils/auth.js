const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../resources/user/user.model');

const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, function (err, decoded) {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'need email and password' });
  }

  try {
    const user = await User.findOne({ email }).select('email password').exec();

    if (!user) {
      return res
        .status(404)
        .send({ message: 'Invalid email and passoword combination' });
    }

    const match = await user.checkPassword(password);

    if (!match) {
      return res
        .status(401)
        .send({ message: 'Invalid email and passoword combination' });
    }

    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'need email and password' });
  }

  try {
    const user = await User.create({
      email,
      password,
    });

    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
};

const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end();
  }

  const token = bearer.split('Bearer ')[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    console.error(e);
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};

module.exports = {
  signin,
  signup,
  protect,
};
