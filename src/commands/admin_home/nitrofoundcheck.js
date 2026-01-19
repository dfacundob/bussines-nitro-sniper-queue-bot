const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('foundcheck')
        .setDescription('Checks if a nitro code is valid.')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category of the ok or not.')
                .setRequired(true)
                .addChoices(
                    { name: 'Ok', value: 'ok' },
                    { name: 'Not', value: 'not' },
                )),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;


        var category = interaction.options.getString('category');
        client.utils.claimTest(client, category)

        if (category == 'ok') {
            interaction.reply({ content: "Ok code claimed!", ephemeral: true });
        } else if (category == 'not') {
            interaction.reply({ content: "Not code claimed!", ephemeral: true });
        }

    },
};