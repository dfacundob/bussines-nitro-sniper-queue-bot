const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpermission')
        .setDescription('Add a claim to the user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Add balance the reseller.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('Reseller server id.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Subcription time.')
                .setRequired(true)
                .addChoices(
                    //{ name: 'Test', value: 'test' },
                    { name: '1 day', value: 'day1' },
                    { name: '5 day', value: 'day5' },
                    { name: '1 week', value: '1w' },
                    { name: '1 month', value: '1m' },
                    { name: '1 year', value: '1y' },
                    { name: 'Lifetime', value: 'lifetime' },
                )),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        const serverid = interaction.options.getString('serverid');
        const time = interaction.options.getString('time');

        //Create new object with guilds.json file
        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        if (guilds[serverid] == undefined) {
            guilds[serverid] = {}
        }
        var startcooldown = new Date().getTime() / 1000

        guilds[serverid]['credits'] = 0,
            guilds[serverid]['timestamp'] = 0,
            guilds[serverid]['permission'] = true,
            guilds[serverid]['suspended'] = false,
            guilds[serverid]['date'] = Math.round(startcooldown)
        guilds[serverid]['allowed_users'] = [user.id],
            guilds[serverid]['data'] = {}
        guilds[serverid]['data']['log_channel'] = "",
            guilds[serverid]['data']['nitro_emoji'] = "😍",
            guilds[serverid]['data']['nitro_basic_emoji'] = "💢",
            guilds[serverid]['data']['nitro_reaction_emoji'] = "💥",
            guilds[serverid]['data']['ping_role'] = "",
            guilds[serverid]['data']['customer_role'] = "",
            guilds[serverid]['data']['new_claim_notification_channel'] = "",
            guilds[serverid]['data']['new_order_notification_channel'] = "",
            guilds[serverid]['data']['queue_embed_channel'] = "",
            guilds[serverid]['data']['queue_embed_color'] = "",
            guilds[serverid]['data']['queue_embed_progress_emoji'] = "`🟢`",
            guilds[serverid]['data']['queue_embed_waiting_emoji'] = "`🟡`",
            guilds[serverid]['data']['bank_embed_channel'] = "",
            guilds[serverid]['data']['bank_embed_color'] = "",
            fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4));


        var timedata = 0;

        switch (time) {
            case 'test':
                timedata = Math.floor(1 * 30)
                break;
            case 'day1':
                timedata = Math.floor(1 * 86400) // 1 day
                break;
            case 'day5':
                timedata = Math.floor(5 * 86400) // 5 day
                break;
            case '1w':
                timedata = Math.floor(7 * 86400) // 1 week
                break;
            case '1m':
                timedata = Math.floor(30 * 86400) // 1 month
                break;
            case '1y':
                timedata = Math.floor(365 * 86400) // 1 year
                break;
            case 'lifetime':
                timedata = 0
                break;
            default:
                timedata = 1
                break;
        }
        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        if (timedata == 0) {
            guilds[serverid]['timestamp'] = timedata
        } else {
            let end = Math.floor(timedata + startcooldown);
            guilds[serverid]['timestamp'] = end
        }

        fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4));

        //config.Notification.resellerRole

        var role = interaction.guild.roles.cache.find(role => role.id === client.config.Notification.resellerRole);
        interaction.member.roles.add(role).catch(async (err) => {
            var logEmbed = await client.utils.newEmbed("Error")
                .setDescription(`[-] Couldn't add role. (Reseller Role)\nError:\n\n ${err.message}`)
            client.utils.sendLog(interaction.guild.id, client, logEmbed);
        });

        /*
        interaction.member.roles.remove(config.quiz.removeroles, 'Successful quiz completion. (Remove roles)').catch(e => {
            console.log("[Quiz] Invaild roles! (Quiz Remove Roles)".red)
        });
        */

        const ordrsChannel = client.server.channels.cache.find(channel => channel.id === guilds[interaction.guild.id]['data']['new_order_notification_channel']);

        const embed2 = new client.Discord.EmbedBuilder()
            .setDescription("`➕` **A new order has been placed.**")
            .setColor(guilds[interaction.guild.id]["data"]["queue_embed_color"] || '#3d3dc4')
            .setThumbnail(user.avatarURL() || client.server.iconURL() || null)
            .addFields([
                { name: "User", value: `<@${user.id}> (${user.username})`, inline: true },
                { name: "Order", value: `Reseller`, inline: true },
            ])
            .setFooter({ text: client.server.name, iconURL: client.server.iconURL() || null })
            .setTimestamp()

        var logEmbed = await client.utils.newEmbed("Reseller permission added")
            .addFields({ name: "User", value: `<@${user.id}> ||(${user.id})||`, inline: false })
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Add permission'], 'Add permission')
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (!ordrsChannel) {
            var logEmbed = await client.utils.newEmbed("Error")
                .setDescription("Order Channel not found.")
            client.utils.sendLog(interaction.guild.id, client, logEmbed);
        } else {
            ordrsChannel.send({ embeds: [embed2] }).catch(err => { });
        }

        interaction.editReply({ content: `**${user.username}** has been added to the reseller list.`, ephemeral: true });
        client.utils.ResellerEmbedUpdate(client);
        //client.utils.checkResllerTime(client);
    }
}