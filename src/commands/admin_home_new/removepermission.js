const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('removepermission')
        .setDescription('Remove permission from a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to remove permission from.')
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
        if (guilds[serverid] == undefined) return interaction.editReply({ content: `**${user.username}** is not in **${serverid}**.`, ephemeral: true });

        guilds[serverid]['credits'] = 0,
            guilds[serverid]['timestamp'] = 1,
            guilds[serverid]['permission'] = false,
            guilds[serverid]['allowed_users'] = [user.id],
            fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4));

        var role = interaction.guild.roles.cache.find(role => role.id === client.config.Notification.resellerRole);
        interaction.member.roles.remove(role).catch(async (e) => {
            var logEmbed = await client.utils.newEmbed("Error")
                .setDescription(`[-] Couldn't remove role. (Reseller Role) \nError:\n\n ${e.message}`)
            client.utils.sendLog(interaction.guild.id, client, logEmbed);
        });

        var logEmbed = await client.utils.newEmbed("Reseller permission removed")
            .addFields({ name: "User", value: `<@${user.id}> ||(${user.id})||`, inline: false })
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Remove permission'], 'Remove permission')
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        interaction.editReply({ content: `**${user.username}** has been removed from **${serverid}**.`, ephemeral: true });
        client.utils.ResellerEmbedUpdate(client);
    }
}