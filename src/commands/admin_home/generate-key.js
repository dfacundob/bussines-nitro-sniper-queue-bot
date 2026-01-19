const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const utils = require('spacejs-utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate-key')
        .setDescription('Generate a key.')
        .addNumberOption(option =>
            option.setName('claims')
                .setDescription('The amount of claims the key has.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('boost-nitro')
                .setDescription('Only detect boost nitro.')
                .setRequired(true)
                .addChoices(
                    { name: 'Yes', value: 'true' },
                    { name: 'No', value: 'false' },
                ))
        .addStringOption(option =>
            option.setName('addrole')
                .setDescription('The role to add to the user.')
                .setRequired(true)
                .addChoices(
                    { name: 'Yes', value: 'yes' },
                    { name: 'No', value: 'no' },
                ))
        .addStringOption(option =>
            option.setName('is-lifetime')
                .setDescription('Is the key lifetime?')
                .setRequired(true)
                .addChoices(
                    { name: 'Yes', value: 'yes' },
                    { name: 'No', value: 'no' },
                ))
        .addUserOption(option =>
            option.setName('send-to-user')
                .setDescription('Send the key to a user.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('key')
                .setDescription('The key to generate.')
                .setRequired(false)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });
        const purple = '#3d3dc4'

        var key = interaction.options.getString('key');
        var addrole = interaction.options.getString('addrole');
        var claims = interaction.options.getNumber('claims');
        var user = interaction.options.getUser('send-to-user');
        var isLifetime = interaction.options.getString('is-lifetime');
        var boostnitro = interaction.options.getString('boost-nitro');
        var keys = JSON.parse(fs.readFileSync("./src/data/keys.json"));
        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        var guildId = interaction.guild.id;

        if (boostnitro == 'true') {
            var boostnitro2 = true;
        } else if (boostnitro == 'false') {
            var boostnitro2 = false;
        } else {
            var boostnitro2 = false;
        }

        if (isLifetime == 'yes') {
            var string = '1x Lifetime';

            const embed = new client.Discord.EmbedBuilder()
                .setDescription("`✅` **Lifetime product added to user.**")
                .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                .setTimestamp()

            interaction.editReply({ embeds: [embed], ephemeral: true });

            if (user) {

                //--------------------SEND ORDER TO CHANNEL--------------------

                var role = interaction.guild.roles.cache.find(role => role.id === client.config.Notification.lifetimeRole);
                interaction.member.roles.add(role).catch(err => {
                    console.log('[-] (lifetimeRole) Error adding role to user. Error: ', err)
                });

                const embed2 = new client.Discord.EmbedBuilder()
                    .setDescription("`➕` **A new order has been placed.**")
                    .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                    .setThumbnail(user.avatarURL() || client.server.iconURL() || null)
                    .addFields([
                        { name: "User", value: `<@${user.id}> (${user.username}#${user.discriminator})`, inline: true },
                        { name: "Oder", value: string, inline: true },
                    ])
                    .setFooter({ text: client.server.name, iconURL: client.server.iconURL() || null })
                    .setTimestamp()

                const ordrsChannel = client.guilds.cache.get(guildId).channels.cache.find(channel => channel.id === guilds[guildId]['data']['new_order_notification_channel']);
                if (!ordrsChannel) {
                    return console.log("[-] newOrderChannel not found.");
                } else {
                    ordrsChannel.send({ embeds: [embed2] }).catch(err => { });
                };

                //--------------------SEND INFO TO USER--------------------

                const embed = new client.Discord.EmbedBuilder()
                    .setTitle("You have successfully received your lifetime nitro. Enjoy!")
                    .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                    .setDescription(`How to redeem your nitro:\n\n1. Go to **${client.server.name}** and type \`/claim-lifetime\`.\n2. You are done! Enjoy your lifetime nitro.\n\n**Note:** You can only do this once a month.`)

                    .setTimestamp()

                user.send({ embeds: [embed] }).catch(err => {
                    interaction.followUp({ content: "I couldn't send the info to the user.", ephemeral: true });
                });
            }

        } else {
            var string = claims;

            if (key == null) {
                var key = await utils.generateRandom(10);


                if (boostnitro2) {
                    keys.push({
                        key: key,
                        claims: claims,
                        addrole: addrole,
                        boost: true
                    });
                } else {
                    keys.push({
                        key: key,
                        claims: claims,
                        addrole: addrole
                    });
                };

            } else {
                if (boostnitro2) {
                    keys.push({
                        key: key,
                        claims: claims,
                        addrole: addrole,
                        boost: true
                    });
                } else {
                    keys.push({
                        key: key,
                        claims: claims,
                        addrole: addrole
                    })
                };
            };

            fs.writeFileSync("./src/data/keys.json", JSON.stringify(keys, null, 4));

            if (addrole == 'yes') {
                var role = interaction.guild.roles.cache.find(role => role.id === guilds[guildId]['data']['customer_role']);
                if (!role) {
                    console.log("[-] (customer_role) Role not found.");
                } else {
                    interaction.member.roles.add(role);
                };
            };

            const embed = new client.Discord.EmbedBuilder()
                .setTitle("Key generated")
                .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                .setThumbnail(client.server.iconURL() || "")
                .addFields([
                    { name: "Claims", value: "`" + claims + "`", inline: true },
                    { name: "Only boost", value: boostnitro.replace("true", "`🟢` Yes").replace("false", "`🔴` No"), inline: true },
                    { name: "Add role in redeem", value: addrole.replace("yes", "`🟢` Yes").replace("no", "`🔴` No"), inline: true },
                    { name: "Key", value: "```" + key + "```", inline: false },
                ])
                .setTimestamp()

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            client.utils.sendLog(client.server.id, client, embed, guilds[client.server.id].data['Key generator'], 'Key generator')
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            interaction.editReply({ embeds: [embed], ephemeral: true }).catch(err => { });

            if (user) {

                //--------------------SEND ORDER TO CHANNEL--------------------


                const embed2 = new client.Discord.EmbedBuilder()
                    .setDescription("`➕` **A new order has been placed.**")
                    .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                    .setThumbnail(user.avatarURL() || client.server.iconURL() || null)
                    .addFields([
                        { name: "User", value: `<@${user.id}> (${user.username}#${user.discriminator})`, inline: true },
                        { name: "Oder", value: `${string}x${boostnitro.replace("true", " only boost").replace("false", " ")} claim`, inline: true },
                    ])
                    .setFooter({ text: client.server.name, iconURL: client.server.iconURL() || null })
                    .setTimestamp()


                const ordrsChannel = client.guilds.cache.get(guildId).channels.cache.find(channel => channel.id === guilds[guildId]['data']['new_order_notification_channel']);
                if (!ordrsChannel) {
                    console.log("[-] newOrderChannel not found.");
                } else {
                    ordrsChannel.send({ embeds: [embed2] }).catch(err => { });
                };

                //--------------------SEND INFO TO USER--------------------

                const embed = new client.Discord.EmbedBuilder()
                    .setTitle("You have received a key")
                    .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                    .setDescription("You have received a key.\n⚠️Redeem it with `/redeem`.\n")
                    .setThumbnail(client.server.iconURL() || "")
                    .addFields([
                        { name: "Claims", value: "```" + claims + "```", inline: true },
                        { name: "Only boost", value: "```" + boostnitro.replace("true", "🟢 Yes").replace("false", "🔴 No") + "```", inline: true },
                        { name: "Key", value: "```" + key + "```", inline: true },
                    ])
                    .setTimestamp()

                user.send({ embeds: [embed] }).catch(err => {
                    console.log(`[-] Couldn't send the key to the user. User: ${user.username}#${user.discriminator}`)
                    interaction.followUp({ content: "I couldn't send the key to the user.", ephemeral: true });
                });
            }
        }
    },
};

