const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart-sniper')
        .setDescription('Restart all snipers.'),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });

        var servers = JSON.parse(fs.readFileSync("./src/data/servers.json"));
        var i_embed = -1;

        var embed = new client.Discord.EmbedBuilder()
            .setTitle("Restart all sniper")
            .setColor(0x00FF00)
            .setDescription("--------------------------------------------------------------------")
            .setFooter({ text: "store.answ3r.hu" });


        for (var i = 0; i < servers.length; i++) {

            client.utils.ssh(servers[i].username, servers[i].password, servers[i].host, servers[i].port, async function (connection) {

                if (connection == 'Connection failed') {
                    i_embed++;

                    embed.addFields({ name: `#${i_embed + 1}`, value: "**" + servers[i_embed].vps_name + "**\n`❌` Connection failed", inline: true });

                    if (i_embed == servers.length - 1) {
                        interaction.editReply({ embeds: [embed], ephemeral: true });
                    }

                    return

                }

                if (connection == null) {
                    i_embed++;
                    embed.addFields({ name: `#${i_embed + 1}`, value: "**" + servers[i_embed].vps_name + "**\n`🔴` Not Running", inline: true });

                    if (i_embed == servers.length - 1) {
                        interaction.editReply({ embeds: [embed], ephemeral: true });
                    }

                    return;
                }


                await connection.execCommand("screen -X -S \"sniper\" kill").then(function (output) {
                })


                //varj meg nezek valamit az en vps emen mi a fasz van varjal


                let node = 'node index.js';
                let dafsnip = './sniper';

                connection.execCommand(`cd ${servers[i - 1].sniperPatch} && screen -d -m -L -S "sniper" ./sniper`).then(function (output) {
                    i_embed++;

                    //if (output.stdout.includes('Socket in')) {
                    embed.addFields({ name: `#${i_embed + 1}`, value: "**" + servers[i_embed].vps_name + "**\n`🟢` Restarted! ", inline: true });
                    //} else {
                    //    embed.addFields({ name: `#${i_embed + 1}`, value: "**" + servers[i_embed].vps_name + "**\n`🔴` Not Running", inline: true });
                    //}

                    if (i_embed == servers.length - 1) {
                        interaction.editReply({ embeds: [embed], ephemeral: true });
                    }
                })


            });
        }
    },
};