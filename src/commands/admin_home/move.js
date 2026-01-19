const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move a user in the queue.')
        .addStringOption(option =>
            option.setName('position')
                .setDescription('The position of the user in the queue.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('newposition')
                .setDescription('The new position of the user in the queue.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        const position = interaction.options.getString('position');
        const newposition = interaction.options.getString('newposition');

        var queue = client.utils.getQueue();

        if (queue.length == 0)
            return interaction.reply({ content: "There is no one in the queue!", ephemeral: true });

        if (position > queue.length || newposition > queue.length)
            return interaction.reply({ content: "Invalid position, please input a valid position.", ephemeral: true });

        let success = await client.utils.moveUserInQueue(client, position, newposition);

        if (success) {
            interaction.reply({ content: `Moved <@${queue[position - 1].userId}> to position ${newposition}.`, ephemeral: true });
            client.utils.checkQueue(client);
        } else {
            interaction.reply({ content: "Invalid position, please input a valid position.", ephemeral: true });
        }
    },
};