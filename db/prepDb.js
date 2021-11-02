require('dotenv').config();
const connect = require('mongoose').connect;

module.exports = async function () {
	try {
		console.log('\nConnecting to DB ...');
		await connect(process.env.DATABASE_URL, {
			appName: 'VolterraDB',
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Connected to DB successful!');
	} catch (err) {
		console.log('\n DB ERROR : ', err.message);
	}
};
