const router = require('express').Router();
const controllers = require('./controllers');
require('dotenv').config();

router.post(`/${process.env.NEW_LINK_TOKEN}`, controllers.getNewLink);

module.exports = router;
