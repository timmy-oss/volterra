const mongoose = require('mongoose');
const {nanoid} = require('nanoid');

const userSchema = mongoose.Schema({
	chainAddress: {
		type: String,
		unique: true,
		maxLength: 48,
		minLength: 8,
		required: true,
	},
	chainType: {type: String, default: 'bsc'},
	referralId: {type: String, unique: true, required: true},
	referees: [{type: mongoose.Types.ObjectId, ref: 'User'}],
	hasReachedCap: {type: Boolean, default: false},
	registeredAt: {type: Date, default: Date.now},
	wallet: {type: Number, max: 1000, default: 0},
	hasRequestedWithdrawal: {type: Boolean, default: false},
});

userSchema.statics.generateReferralLink = async function () {
	let length = 5;
	let ref = null;
	let lastMonitor = 0;
	let currentMonitor = 0;

	do {
		ref = nanoid(length);
		++currentMonitor;
		if (currentMonitor - lastMonitor > 10) {
			lastMonitor = currentMonitor;
			length += 1;
		}
	} while (await User.exists({referralId: ref}));

	return ref;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
