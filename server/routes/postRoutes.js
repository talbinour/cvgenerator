const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
  console.log(req.body);
  const { data } = req.body; // Assuming your request payload is { "data": "adarsh" }
  try {
    if (data === 'adarsh') {
      res.send({ status: 'ok' });
    } else {
      res.send({ status: 'User Not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;