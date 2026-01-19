const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('suspension')
        .setDescription('Suspension the reseller.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Reseller user.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');

        var check = false;
        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        for (var guild of Object.keys(guilds)) {
            if (guilds[guild]['allowed_users'][0] === user.id) {
                guilds[guild].suspended = true;
                fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4));
                check = true;

            }
        }

        if (check == false) {
            await interaction.editReply({ content: '`❌` User not found.', ephemeral: true });
            return;
        } else {

            var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

            var logEmbed = await client.utils.newEmbed("Supsesion")
                .addFields({ name: "User", value: `<@${interaction.user.id}> ||(${interaction.user.id})||`, inline: false })
                .addFields({ name: "User suspended", value: `<@${user.id}> ||(${user.id})||`, inline: false })
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Supsesion'], 'Supsesion')
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            await interaction.editReply({ content: '`✔️` User suspended.', ephemeral: true });
        }

    }
}