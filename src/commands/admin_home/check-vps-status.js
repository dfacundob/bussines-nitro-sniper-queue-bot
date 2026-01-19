const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-vps-status')
        .setDescription('Checks the status of a VPS.'),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });

        var servers = JSON.parse(fs.readFileSync("./src/data/servers.json"));
        var i_embed = -1;

        var listaa = [];
        const lista1 = [];
        const lista2 = [];
        const lista3 = [];

        function send() {

            listaa.forEach((elem) => {
                if (lista1.length < 12) {
                    lista1.push(elem);
                } else if (lista2.length < 12) {
                    lista2.push(elem);
                } else {
                    lista3.push(elem);
                }
            });

            if (lista1.length == 0)
                lista1.push('No data.');

            if (lista2.length == 0)
                lista2.push('No data.');

            if (lista3.length == 0)
                lista3.push('No data.');

            var embed1 = new client.Discord.EmbedBuilder()
                .setTitle("VPS Status")
                .setColor(0x00FF00)
                .setDescription(lista1.join('\n'))
            //.setFooter({ text: "store.answ3r.hu" });
            var embed2 = new client.Discord.EmbedBuilder()
                //.setTitle("VPS Status")
                .setColor(0x00FF00)
                .setDescription(lista2.join('\n'))
            //.setFooter({ text: "store.answ3r.hu" });
            var embed3 = new client.Discord.EmbedBuilder()
                //.setTitle("VPS Status")
                .setColor(0x00FF00)
                .setDescription(lista3.join('\n'))
                .setFooter({ text: "store.answ3r.hu" });

            interaction.editReply({ embeds: [embed1, embed2, embed3], ephemeral: true });

        }

        for (var i = 0; i < servers.length; i++) {

            client.utils.ssh(servers[i].username, servers[i].password, servers[i].host, servers[i].port, function (connection) {

                if (connection == 'Connection failed') {
                    i_embed++;

                    listaa.push(`${i_embed + 1}: ${servers?.[i_embed]?.vps_name}: \`❌ Connection failed\``)

                    if (i_embed == servers.length - 1) {
                        //console.log(listaa)
                        send();
                    }

                };

                if (connection == null) {
                    i_embed++;
                    //embed.addFields({ name: `#${i_embed + 1}`, value: "**" + servers?.[i_embed]?.vps_name + "**\n`🔴` Not Running", inline: true });
                    listaa.push(`${i_embed + 1}: ${servers?.[i_embed]?.vps_name}: \`🔴 Not Running\``)

                    if (i_embed == servers.length - 1) {
                        //console.log(listaa)
                        send();
                    }
                }

                connection.execCommand("screen -ls").then(function (output) {
                    i_embed++;

                    if (output.stdout.includes('Socket in')) {
                        //embed.addFields({ name: `#${i_embed + 1}`, value: "**" + servers?.[i_embed]?.vps_name + "**\n`🟢` Running", inline: true });
                        listaa.push(`${i_embed + 1}: ${servers?.[i_embed]?.vps_name}: \`🟢 Running\``)
                    } else if (output.stdout.includes('Sockets in')) {
                        //embed.addFields({ name: `#${i_embed + 1}`, value: "**" + servers?.[i_embed]?.vps_name + "**\n`🟢` Running", inline: true });
                        listaa.push(`${i_embed + 1}: ${servers?.[i_embed]?.vps_name}: \`🟢 Running\``)
                    } else {
                        //embed.addFields({ name: `#${i_embed + 1}`, value: "**" + servers?.[i_embed]?.vps_name + "**\n`🔴` Not Running", inline: true });
                        listaa.push(`${i_embed + 1}: ${servers?.[i_embed]?.vps_name}: \`🔴 Not Running\``)
                    };

                    if (i_embed == servers.length - 1) {
                        //console.log(listaa)
                        send();
                    };
                })
            });
        }



    },
};