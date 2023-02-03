const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const { errorHandler } = require('./src/helpers/apiHelpers');
const contactsRouter = require('./src/routes/contactsRoute');
const usersRouter = require('./src/routes/usersRouter');
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use('/avatars', express.static('./src/public/avatars'));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);

app.use('/api/contacts', contactsRouter);

app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
