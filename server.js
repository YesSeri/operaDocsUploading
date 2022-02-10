require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const uploadRoute = require('./routesCreate/uploadsRoutes');
const postsRoute = require('./routesCreate/postsRoutes');
console.log(postsRoute)

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.use('/posts', postsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening at port ${port}`));
