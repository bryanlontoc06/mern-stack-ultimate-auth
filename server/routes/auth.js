const express = require('express');
const router = express.Router();


router.get('/signup', (req, res) => {
    res.json({
        data: 'You have successfully signed up'
    });
});



module.exports = router;