require('dotenv').config();
const express = require('express');
const userRouter = require('./airdrop/router');
const prepDb = require('./db/prepDb');
const {admitNewReferral} = require('./airdrop/controllers');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.set('view engine', 'ejs');
app.set('view options', {delimiter: '?'});

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/volterra-airdrop/', (req, res) => {
	res.render('airdrop', {
		url: 'https://volterra-x5.herokuapp.com/api/v1/bsc',
		ref: null,
	});
});

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
