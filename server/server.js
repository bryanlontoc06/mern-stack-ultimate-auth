const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();



const app = express();

// connect to mongodb
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(`DB CONNECTION ERROR`, err));


// import the routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// app middleware
app.use(morgan('dev'));
app.use(bodyParser.json());


// app.use(cors()); // allow all requests from all domains
if (process.env.NODE_ENV === 'development') {
    app.use(cors({origin: `http://localhost:3000`}));
}



// import the middleware
app.use(`/api`, authRoutes);
app.use(`/api`, userRoutes);





const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});