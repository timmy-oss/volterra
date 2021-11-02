const User = require('../db/schema/user');
require('dotenv').config();

const MAX_OBTAINABLE_AIRDROP = process.env.MAX_OBTAINABLE_AIRDROP;
const AIRDROP_PER_REFERRAL = process.env.AIRDROP_PER_REFERRAL;
const TWO_HUNDRED_TOKENS = 200;
const V_IN_D = process.env.V_IN_D;

const getRefLink = (refId) => `${process.env.REFERRAL_BASE_URL}/${refId}`;

async function admitNewReferral(req, res) {
	switch (req.method) {
		case 'GET':
			res.render('index', {
				url: 'https://volterra-x5.herokuapp.com/api/v1/create-new',
				ref: req.params.ref,
			});

			break;
		case 'POST':
			const ref = req.body.ref;
			const chainAddress = req.body.chainAddress || '';

			if (!chainAddress) {
				res.status(401).end();
				console.log(' CHAIN : ', chainAddress);
				return;
			}

			let user = null;
			let newUser = null;
			try {
				const userExists = await User.exists({referralId: ref});
				if (!userExists) {
					res.status(401).end();
				} else {
					const chainExists = await User.exists({
						chainAddress,
					});

					if (chainExists) {
						const user = await User.findOne({
							chainAddress,
						})
							.lean()
							.exec();
						const response = {
							link: getRefLink(user.referralId),
							balance: user.wallet,
							referred: user.referees.length,
							rewards:
								user.referees.length * AIRDROP_PER_REFERRAL,
							balanceInUSD: (user.wallet * V_IN_D).toFixed(2),
							rewardsInUSD: (
								user.referees.length *
								AIRDROP_PER_REFERRAL *
								V_IN_D
							).toFixed(2),
						};
						res.status(200).json(response);
						return;
					}

					user = await User.findOne({referralId: ref}).exec();
					newUser = await User.create({
						chainAddress,
						referralId: await User.generateReferralLink(),
						wallet: TWO_HUNDRED_TOKENS,
					});

					if (!user.hasReachedCap) {
						user.referees.push(newUser._id);
						user.wallet += AIRDROP_PER_REFERRAL;

						if (user.wallet >= MAX_OBTAINABLE_AIRDROP) {
							user.hasReachedCap = true;
						}
					} else {
						user.referees.push(newUser._id);
					}

					await user.save();
				}

				const response = {
					link: getRefLink(newUser.referralId),
					balance: newUser.wallet,
					referred: newUser.referees.length,
					rewards: newUser.referees.length * AIRDROP_PER_REFERRAL,
					balanceInUSD: (user.wallet * V_IN_D).toFixed(2),
					rewardsInUSD: (
						user.referees.length *
						AIRDROP_PER_REFERRAL *
						V_IN_D
					).toFixed(2),
				};
				res.status(200).json(response);
			} catch (err) {
				console.log(err.message);
				res.status(500).end();
			}
	}
}

async function getNewLink(req, res) {
	const newLink = await User.generateReferralLink();
	const chainAddress = req.body.chainAddress || '';

	if (!chainAddress) {
		res.status(401).end();
		// console.log(' CHAIN : ', chainAddress);
		return;
	}

	const chainExists = await User.exists({
		chainAddress,
	});

	if (chainExists) {
		const user = await User.findOne({chainAddress}).lean().exec();
		const response = {
			link: getRefLink(user.referralId),
			balance: user.wallet,
			referred: user.referees.length,
			rewards: user.referees.length * AIRDROP_PER_REFERRAL,
			balanceInUSD: (user.wallet * V_IN_D).toFixed(2),
			rewardsInUSD: (
				user.referees.length *
				AIRDROP_PER_REFERRAL *
				V_IN_D
			).toFixed(2),
		};
		res.status(200).json(response);
		return;
	}

	const user = await User.create({
		chainAddress,
		referralId: newLink,
		wallet: TWO_HUNDRED_TOKENS,
	});

	const response = {
		link: getRefLink(user.referralId),
		balance: user.wallet,
		referred: user.referees.length,
		rewards: user.referees.length * AIRDROP_PER_REFERRAL,
		balanceInUSD: (user.wallet * V_IN_D).toFixed(2),
		rewardsInUSD: (user.referees.length * AIRDROP_PER_REFERRAL * V_IN_D).toFixed(2),
	};

	res.status(201).json(response);
}

module.exports = {
	getNewLink,
	admitNewReferral,
};
