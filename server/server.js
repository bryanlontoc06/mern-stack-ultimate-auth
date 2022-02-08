const express = require('express');
const app = express();


// import the routes
const authRoutes = require('./routes/auth');

// import the middleware
app.use(`/api`, authRoutes);





const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});