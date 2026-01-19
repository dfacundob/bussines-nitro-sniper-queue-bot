const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-main-token')
        .setDescription('Updates the main token.'),
    async execute(interaction, client) {

        if (client.utils.home_permCheck(interaction, client)) {

            await interaction.deferReply({ ephemeral: true });
            var queue = client.utils.getQueue();
            client.utils.checkQueue(client);

            if (queue.length > 0) {
                interaction.editReply({ content: "There are still tokens in the queue! Please wait until the queue is empty before updating the main token.", ephemeral: true });
            } else {
                interaction.editReply({ content: "The main token has been updated!", ephemeral: true });
            }
        }

    },
};