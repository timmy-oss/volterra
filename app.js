require('dotenv').config();
const express = require('express');
const userRouter = require('./airdrop/router');
const prepDb = require('./db/prepDb');
const {routeReferee} = require('./airdrop/controllers');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use('/api/v1', cors(), userRouter);

app.get('/r/:ref/', cors(), routeReferee);


//processes
prepDb();

if (require.main === 'module') {
	return app;
} else {
	app.listen(process.env.PORT, () => {
		console.log(
			`${process.env.SITENAME} server running on port ${process.env.PORT}`
		);
	});
}
