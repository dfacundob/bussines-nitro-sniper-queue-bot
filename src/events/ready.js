var cron = require('node-cron');
const fs = require('fs');

cron.schedule('0 0 1 * *', () => {
	fs.writeFile('./src/data/lifetime.json', JSON.stringify({}), (err) => {
		if (err) console.log(err);
	});
});

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {

		// Set the bot's activity
		client.user.setPresence({
			activities: [{ name: client.config["Bot Settings"].activity.name, type: client.Discord.ActivityType[client.config["Bot Settings"].activity.type] }],
			status: `online`,
		});

		//var queue = client.utils.getQueue(client);

		await client.utils.checkQueue(client);
		//client.utils.QueueEmbedUpdate(client);
		client.utils.StatEmbedUpdate(client);
		client.utils.BankEmbedUpdate(client);
		client.utils.checkResllerTime(client);
		client.utils.ResellerEmbedUpdate(client);

		var time = client.config['Sniper Settings'].checkTokenTime * 60000; //DEFAULT: 60.000

		if (client.config['Sniper Settings'].checkTokenTime == 0) { } else {
			setInterval(() => {
				client.utils.checkQueueToken(client)
			}, time); //5 minutes = 300000, 2 minutes = 60000, 10 minutes = 12000 
		}

		// Set the interval for the queue embed
		if (client.config.Stats.enabled == true) {
			setInterval(() => {
				client.utils.StatEmbedUpdate(client);
			}, 300000);
		}

		setInterval(() => {
			client.utils.checkResllerTime(client);
			client.utils.ResellerEmbedUpdate(client);
		}, 60000);

		//auth.connect()

	},
};