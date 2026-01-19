const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('cancelorder')
        .setDescription('Cancels an order for a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to cancel the order for.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.reseller_permCheck(interaction, client) == false) return;
        if (client.utils.guild_permCheck(interaction, client) == false) return;
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        var credits = JSON.parse(fs.readFileSync('./src/data/credits.json', 'utf8'));


        var queue = client.utils.getQueue();
        var rmcredits = 0;
        var oldgeci = '';

        //remove user from queue
        for (var i = 0; i < queue.length; i++) {
            if (queue[i].userId == user.id) {
                oldgeci = `${queue[i].used}/${queue[i].total}`
                rmcredits += queue[i].total - queue[i].used
                queue.splice(i, 1);
                break;
            }
        }

        client.utils.saveQueue(queue);
        client.utils.checkQueue(client);
        client.utils.QueueEmbedUpdate(client);

        //remove user from credit
        guilds[interaction.guild.id].credits += rmcredits
        fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4))

        // ========================= LOG ========================= //
        var logEmbed = await client.utils.newEmbed("Cancelled Order")
            .addFields(
                { name: "Server", value: `${interaction.guild.name}`, inline: true },
                { name: "Executor", value: `${interaction.user.username}`, inline: true },
                { name: "Server balance", value: `${guilds[interaction.guild.id]['credits']}`, inline: true },
                { name: "Reseller", value: `<@${guilds[interaction.guild.id]['allowed_users'][0]}>`, inline: true },
                { name: "User", value: `${user.username}`, inline: true },
                { name: "User claims", value: oldgeci, inline: true })
        client.utils.sendLog(client.server.id, client, logEmbed);
        client.utils.sendLog(interaction.guild.id, client, logEmbed);
        // ========================= LOG ========================= //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Order canceled'], 'Order canceled')
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        interaction.editReply({ content: `Successfully cancelled order for ${user.username}!`, ephemeral: true });

    },
};