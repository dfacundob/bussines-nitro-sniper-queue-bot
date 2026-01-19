const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removevps')
        .setDescription('Removes a VPS from the database.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the VPS.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        var name = interaction.options.getString('name');

        client.utils.removeVPS(client, name);
        interaction.reply({ content: `Removed ${name} from the database.`, ephemeral: true });
    },
};