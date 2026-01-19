const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update-queue')
        .setDescription('Updates the queue.'),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;
        await interaction.deferReply({ ephemeral: true });

        await client.utils.checkQueue(client);

        client.utils.QueueEmbedUpdate(client);
        interaction.editReply({ content: "Updated the queue.", ephemeral: true });
    },
};