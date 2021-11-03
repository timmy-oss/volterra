const TelegramBot = require('node-telegram-bot-api');
const User = require('./../db/schema/user');
require('dotenv').config();

const MAX_OBTAINABLE_AIRDROP = process.env.MAX_OBTAINABLE_AIRDROP;
const AIRDROP_PER_REFERRAL = process.env.AIRDROP_PER_REFERRAL;
const TWO_HUNDRED_TOKENS = 200;
const V_IN_D = process.env.V_IN_D;
const token = process.env.TG_TOKEN;
let bot;
let URL;

if (process.env.NODE_ENV === 'production') {
	bot = new TelegramBot(token);
	URL = process.env.HEROKU_URL;
	bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
	bot = new TelegramBot(token, {polling: true});
	URL = 'http://localhost:3000/';
}

bot.onText(/0xw{40,48}/, async (msg) => {
	if (await User.exists({chatId: msg.chat.id})) {
		if (
			msg.text.startsWith('0x') ||
			msg.text.length < 40 ||
			msg.text.length > 48
		) {
			const user = await User.findOne({chatId: msg.chat.id});
			(user.wallet = TWO_HUNDRED_TOKENS),
				(user.referralId = await User.generateReferralLink()),
				(user.chainAddress = msg.text.trim()),
				await user.save();

			bot.sendMessage(
				msg.chat.id,
				`

                ✳️ Congrats! ${msg.chat.username} 💩, you have successfully registered for the Volterra Airdrop.


                `
			);
		} else {
			bot.sendMessage(msg.chat.id, 'Please enter a valid Bsc address!');
		}
	}

	return;
});

bot.onText(/I understand, Proceed/, async (msg) => {
	// if (msg.text.toUpperCase() !== 'JOIN AIRDROP') {
	// 	return;
	// }

	await User.create({
		chatId: msg.chat.id,
	});

	bot.sendMessage(
		msg.chat.id,
		`
Please, enter your BSC address

    `,
		{
			reply_markup: {
				keyboard: [],
			},
		}
	);
});

bot.onText(/🚀 Join Airdrop/, (msg) => {
	// if (msg.text.toUpperCase() !== 'JOIN AIRDROP') {
	// 	return;
	// }

	bot.sendMessage(
		msg.chat.id,
		`
     🚩 Dear ${msg.chat.username}, please ensure you have satisfied all the requirements 🔐 , or no airdrop will be sent to your wallet when distribution commences.


    `,
		{
			reply_markup: {
				keyboard: [['I understand, Proceed']],
				resize_keyboard: true,
				one_time_keyboard: true,
				force_reply: true,
			},
		}
	);
});

bot.onText(/\/start/, async (msg) => {
	console.log(URL + 'volterra.jpg');
	await bot.sendPhoto(
		msg.chat.id,
		'https://volterra-x5.herokuapp.com/volterra.jpg'
	);

	bot.sendMessage(
		msg.chat.id,
		`

    Hello! ${msg.chat.username}, Welcome To Volterra Ecosystem

🔐 Please Complete All The Required Tasks To Get Airdrop Rewards.

🏄 Join Volterra Ecosystem Telegram Channel (https://t.me/Volterratoken) and Group
 (https://t.me/volterranews)🏄 Follow Volterra Ecosystem Official Twitter (https://twitter.com/Volterra_Eco) & Retweet Pinned Tweet
🏄 Follow Volterra President Twitter
 (https://twitter.com/michaeljimoh0)
🏄 Follow On Linkedin (https://www.linkedin.com/company/volterra-ecosystem)
🏄 Follow On Reddit  (https://www.reddit.com/r/Volterra_Ecosystem?utm_medium=android_app&utm_source=share)
🏄 Submit your Binance Smart Chain BEP20 Wallet Address

📘By Participating You Are Agreeing To Volterra Airdrop Program Terms and Conditions.

Click "🚀 Join Airdrop" to proceed





    `,
		{
			reply_markup: {
				keyboard: [['🚀 Join Airdrop']],
				resize_keyboard: true,
				one_time_keyboard: true,
				force_reply: true,
			},
		}
	);
});

module.exports = {
	bot,
};
