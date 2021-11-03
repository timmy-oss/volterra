const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TG_TOKEN;
let bot;

if (process.env.NODE_ENV === 'production') {
	bot = new TelegramBot(token);
	bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
	bot = new TelegramBot(token, {polling: true});
}

bot.onText(/Join Airdrop/, (msg) => {
	// if (msg.text.toUpperCase() !== 'JOIN AIRDROP') {
	// 	return;
	// }

	bot.sendMessage(
		msg.chat.id,
		`
     Dear ${msg.chat.username}, please ensure you have satisfied all the requirements, or no airdrop will be sent to your wallet when distribution commences.


    `,
		{
			reply_markup: {
				keyboard: [['I understand, Proceed']],
				resize_keyboard: true,
				one_time_keyboard: false,
				force_reply: true,
			},
		}
	);
});

bot.onText(/\/start/, (msg) => {
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
				keyboard: [['Join Airdrop']],
				resize_keyboard: true,
				one_time_keyboard: false,
				force_reply: true,
			},
		}
	);
});

module.exports = {
	bot,
};
