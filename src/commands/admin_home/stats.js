const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows the bot\'s stats.'),
    async execute(interaction, client) {

        if (client.utils.home_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });

        var guildsAmount = 0;
        var alts = 0;

        for (var i = 0; i < client.config.Stats.licenses.length; i++) {
            await axios({
                method: 'get', // GET Request
                url: `http://tsukuyomi.wtf/api/prod/stats`,
                headers: {
                    //'x-api-key': '8300c7c5-7761-XO38-90ec-2cc1e7d8046b'
                    'x-api-key': client.config.Stats.licenses[i].license
                }
            }).then(async (res) => {

                if (res == undefined) return;
                const data = res.data;

                guildsAmount = parseInt(data.type.overall.guildsAmount);
                alts = parseInt(data.type.overall.alts);

                const embed = new client.Discord.EmbedBuilder()
                    .setTitle('Stats')
                    .setColor(client.config["Queue Embed Settings"].color || 0x00FF00)
                    .setDescription(`**Guilds:** ${guildsAmount}\n**Alts:** ${alts}`)

                await interaction.editReply({ embeds: [embed], ephemeral: true });

            })

                .catch((err) => {
                    console.log("[-] Error while getting stats from API: " + err)
                });
            if (api == undefined) return;
            const data = api.data;

            //console.log(parseInt(data.type.overall.alts))



        }
    },
};