const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addvps')
        .setDescription('Adds a VPS to the database.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the VPS.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('The IP of the VPS.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('port')
                .setDescription('The port of the VPS.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the VPS.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('password')
                .setDescription('The password of the VPS.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sniper-path')
                .setDescription('The path of the sniper.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sniper-data-path')
                .setDescription('The path of the data sniper.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        var name = interaction.options.getString('name');
        var ip = interaction.options.getString('ip');
        var port = interaction.options.getString('port');
        var username = interaction.options.getString('username');
        var password = interaction.options.getString('password');
        var sniperPath = interaction.options.getString('sniper-data-path');
        var SniperPatch = interaction.options.getString('sniper-path');

        await client.utils.addVPS(client, name, ip, port, username, password, sniperPath, SniperPatch);
        client.utils.checkQueue(client);
        interaction.reply({ content: `Added ${name} to the database.`, ephemeral: true });
    },
};