const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Add a claim to the user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Add command permissions to the user.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('Reseller server id.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        const serverid = interaction.options.getString('serverid');
        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        if (guilds[serverid] == undefined) {
            return interaction.editReply({ content: 'Server not found.', ephemeral: true });
        }

        if (guilds[serverid]['allowed_users'].includes(user.id) == false) {
            guilds[serverid]['allowed_users'].push(user.id);
            fs.writeFileSync('./src/data/guilds.json', JSON.stringify(guilds, null, 4));
            return interaction.editReply({ content: 'User added.', ephemeral: true });
        } else {
            return interaction.editReply({ content: 'User already added.', ephemeral: true });
        }
    }
}