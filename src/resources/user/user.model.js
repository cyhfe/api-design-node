const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//密码保存之前加密
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  console.log(this.password);
  bcrypt.hash(this.password, 8, (err, hash) => {
    // Store hash in your password DB.
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

//判断密码是否正确
userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }
      resolve(same);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
