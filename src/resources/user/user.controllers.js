const User = require('./user.model');

const me = (req, res) => {
  res.status(200).json({ data: req.user });
};

const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    })
      .lean() //return plain javascript objects, not Mongoose Documents
      .exec(); // Executes the query, return Promise
    res.status(200).json({ data: user });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

module.exports = {
  me,
  updateMe,
};
