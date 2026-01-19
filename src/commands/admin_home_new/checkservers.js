const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkservers')
        .setDescription('Get a list of all the servers the bot is in.'),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;
        await interaction.deferReply({ ephemeral: true });
        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        var embed = new EmbedBuilder()
        var i = 0;
        for (const guild of Object.keys(guilds)) {
            i++;
            var server = client.guilds.cache.get(guild);
            var valtozo_xddd_halfenglis_szet_baszlak_jazmin = '';

            var timenow = new Date().getTime() / 1000
            try { var userendtime = guilds[guild]['timestamp'] } catch { }
            if (userendtime === 0) {
                valtozo_xddd_halfenglis_szet_baszlak_jazmin = '\`♾️\` Lifetime';
            }
            var checking_time = userendtime - timenow
            if (checking_time > 0) {
                valtozo_xddd_halfenglis_szet_baszlak_jazmin = `\`⏱️\` <t:${userendtime}:R>`;
            }
            try {
                var a = server.name
                var b = server.id //xddd 
            } catch {
                var a = 'Not joined server'
                var b = '---'
            }

            embed.addFields({ name: `${i}# guild`, value: `${a}\n(${b})\n\n**Sub:** ${valtozo_xddd_halfenglis_szet_baszlak_jazmin}\n**Credits:** ${guilds[guild]['credits']}\n**Res:** <@${guilds[guild]['allowed_users'][0]}>\n**Perm:** ${guilds[guild]['permission']}\n**Susp:** ${guilds[guild]['suspended']}`, inline: true });
        }

        embed.setTitle('Server List');
        embed.setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
        await interaction.editReply({ embeds: [embed] });
    }
}