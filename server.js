if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const path = require('path');
const app = express();

const uploadRoute = require('./routesCreate/uploadsRoutes');
const postsRoute = require('./routesCreate/postsRoutes');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use('/upload', uploadRoute);
app.use('/posts', postsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening at port ${port}`));
