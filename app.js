require('dotenv').config();
const express = require('express');
const userRouter = require('./airdrop/router');
const prepDb = require('./db/prepDb');
const {admitNewReferral} = require('./airdrop/controllers');
const morgan = require('morgan');
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use('/api/v1', userRouter);

app.get('/r/:ref/', admitNewReferral);

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
