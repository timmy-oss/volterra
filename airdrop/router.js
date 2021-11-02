const router = require('express').Router();
const controllers = require('./controllers');
require('dotenv').config();

router.post(`/${process.env.NEW_LINK_TOKEN}`, controllers.getNewLink);

router.post(`/create-new/`, controllers.admitNewReferral);




module.exports = router;
