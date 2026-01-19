const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get reseller data'),
    async execute(i, client) {
        if (client.utils.reseller_permCheck(i, client) == false) return;
        if (client.utils.guild_permCheck(i, client) == false) return;
        await i.deferReply({ ephemeral: true });

        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        var valtozo_xddd_halfenglis_szet_baszlak_jazmin = '';

        var timenow = new Date().getTime() / 1000
        try { var userendtime = guilds[i.guild.id]['timestamp'] } catch { }
        if (userendtime === 0) {
            valtozo_xddd_halfenglis_szet_baszlak_jazmin = '\`♾️\` Lifetime';
        }
        var checking_time = userendtime - timenow
        if (checking_time > 0) {
            valtozo_xddd_halfenglis_szet_baszlak_jazmin = `\`⏱️\` <t:${userendtime}:R>`;
        }

        const embed = new EmbedBuilder()
            .setColor(guilds[i.guild.id]['data']['queue_embed_color'] || '#3d3dc4')
            .setAuthor({ name: `${i.guild.name}`, iconURL: i.guild.iconURL({ dynamic: true }) })
            .setThumbnail(i.guild.iconURL({ dynamic: true }))
            .setTitle('Reseller Info')
            //embed.setDescription(`Reseller:`)
            .addFields({ name: "Subscriptions", value: `${valtozo_xddd_halfenglis_szet_baszlak_jazmin}`, inline: true })
            .addFields({ name: "Credits", value: `${guilds[i.guild.id]['credits']} credits`, inline: true })
            .addFields({ name: "Joined Time", value: `<t:${guilds[i.guild.id]['date'] || 0}:R>`, inline: true })
            .addFields({
                name: "Allowed members", value: `${guilds[i.guild.id]['allowed_users'].length > 0 ? guilds[i.guild.id]['allowed_users'].map(i => '<@' + i + '>').join('\n') : 'None'}`
            })

        i.editReply({ embeds: [embed], ephemeral: true });

    }
}