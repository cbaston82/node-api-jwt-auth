const express = require('express');
const app = express();
const morgan = require('morgan');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

dotEnv.config();

mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}
)
    .then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
    console.log(`DB Connection Error: ${err.message}`);
});

// bring in routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({error: 'Unauthorized'});
    }
    next();
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});