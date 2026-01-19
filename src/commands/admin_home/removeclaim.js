const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeclaim')
        .setDescription('Remove a claim from the user.')
        .addStringOption(option =>
            option.setName('position')
                .setDescription('The position of the user in the queue.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of codes to claim.')
                .setRequired(false)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        const position = interaction.options.getString('position');
        const amount = interaction.options.getInteger('amount');

        if (1 > amount) {
            return interaction.reply({ content: '`✖️` Not a valid amount!', ephemeral: true }).catch(err => {});
        }

        var queue = client.utils.getQueue();

        if (position < 1 || position > queue.length)
            return interaction.reply({ content: "Invalid position, please input a valid position.", ephemeral: true });

        if (amount == null) {
            client.utils.removeUserFromQueue(client, position);
            return interaction.reply({ content: `Removed <@${queue[position - 1].userId}> from the queue.`, ephemeral: true });
        }

        if (queue[position - 1].total < amount)
            return interaction.reply({ content: "Invalid amount, please input a valid amount.", ephemeral: true });

        if (queue[position - 1].total == amount) {
            client.utils.removeUserFromQueue(client, position);
            return interaction.reply({ content: `Removed <@${queue[position - 1].userId}> from the queue.`, ephemeral: true });
        }

        client.utils.removeUserClaim(client, position - 1, amount);
        interaction.reply({ content: `Removed ${amount} claims from <@${queue[position - 1].userId}>.`, ephemeral: true });
    },
};