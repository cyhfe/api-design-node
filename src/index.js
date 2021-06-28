const express = require('express');
const mongoose = require('mongoose');

const { json, urlencoded } = require('body-parser');
//HTTP request logger middleware for node.js
const morgan = require('morgan');

const userRouter = require('./resources/user/user.router');
// const itemRouter = require('./resources/item/item.router')

const { signin, signup, protect } = require('./utils/auth');

const app = express();

//disable the X-Powered-By header. 默认启用,会返回有关服务器信息的header
app.disable('x-powered-by');

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.post('/signup', signup);
app.post('/signin', signin);

app.use('/api', protect);
app.use('/api/user', userRouter);
// app.use('/api/item', itemRouter)
// app.use('/api/list', listRouter)

mongoose.set('useCreateIndex', true)
mongoose
  .connect('mongodb://localhost:27017/api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connect to database');
    app.listen(3000, () => {
      console.log('server runing in port 3000');
    });
  });
