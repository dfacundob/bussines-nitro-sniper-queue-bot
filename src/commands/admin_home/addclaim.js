const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addclaim')
        .setDescription('Add a claim to the user.')
        .addStringOption(option =>
            option.setName('position')
                .setDescription('The position of the user in the queue.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of codes to claim.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        const position = interaction.options.getString('position');
        const amount = interaction.options.getInteger('amount');

        if (1 > amount) {
            return interaction.editReply({ content: '`✖️` Not a valid amount!', ephemeral: true });
        }

        var queue = client.utils.getQueue();

        if (position < 1 || position > queue.length)
            return interaction.reply({ content: "Invalid position, please input a valid position.", ephemeral: true });

        client.utils.addClaimToUser(client, position - 1, amount);
        interaction.reply({ content: `Added ${amount} claims to <@${queue[position - 1].userId}>.`, ephemeral: true });
    },
};


