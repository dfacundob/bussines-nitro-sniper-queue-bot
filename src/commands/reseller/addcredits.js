const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('addcredits')
        .setDescription('Add a claim to the user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Add credits to this user.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Add amount to this user in cents.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.reseller_permCheck(interaction, client) == false) return;
        if (client.utils.guild_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const guildId = interaction.guild.id;

        var credits = JSON.parse(fs.readFileSync("./src/data/credits.json"));
        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));


        if (1 > amount) {
            return interaction.editReply({ content: '`✖️` Not a valid amount!', ephemeral: true });
        }

        if (guilds[guildId].credits < amount) return interaction.editReply({ content: `\`✖️\` You don't have enough credits to add this amount.` });

        //create a new object
        if (!credits[guildId]) {
            credits[guildId] = {}
        }

        if (!credits[guildId][user.id]) {
            credits[guildId][user.id] = 0
            fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4))
        }

        credits[guildId][user.id] += amount;
        fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4))

        guilds[guildId]['credits'] -= amount;
        fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4))

        // ========================= LOG ========================= //
        var logEmbed = await client.utils.newEmbed("Add Credits")
            .addFields(
                { name: "Server", value: `${interaction.guild.name}`, inline: true },
                { name: "Executor", value: `${interaction.user.username}`, inline: true },
                { name: "Server balance", value: `${guilds[guildId]['credits']}`, inline: true },
                { name: "Reseller", value: `<@${guilds[guildId]['allowed_users'][0]}>`, inline: true },
                { name: "User", value: `${user.username}`, inline: true },
                { name: "User balance", value: `${credits[guildId][user.id]}`, inline: true })
        client.utils.sendLog(client.server.id, client, logEmbed);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Add credits'], 'Add credits')
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // ========================= LOG ========================= //

        interaction.editReply({ content: `\`✔️\` Successfully added \`${amount}\` credits to \`${user.username}\`\n\n\`💲\` Available credits: \`${guilds[guildId]['credits']}\`` });

        const ordrsChannel = client.guilds.cache.get(guildId).channels.cache.find(channel => channel.id === guilds[guildId]['data']['new_order_notification_channel']);
        var role = interaction.guild.roles.cache.find(role => role.id === guilds[guildId]['data']['customer_role']);
        let member = interaction.guild.members.cache.get(user.id);

        member.roles.add(role).catch(async (err) => {
            var logEmbed = await client.utils.newEmbed("Error")
                .setDescription(`[-] Couldn't add role.\nError:\n\n ${err.message}`)
            client.utils.sendLog(guildId, client, logEmbed);
        });

        const embed2 = new client.Discord.EmbedBuilder()
            .setDescription("`➕` **A new order has been placed.**")
            .setColor(guilds[guildId]["data"]["queue_embed_color"] || '#3d3dc4')
            .setThumbnail(user.avatarURL() || client.server.iconURL() || null)
            .addFields([
                { name: "User", value: `<@${user.id}> (${user.username})`, inline: true },
                { name: "Oder", value: `${amount}x credit`, inline: true },
            ])
            .setFooter({ text: client.server.name, iconURL: client.server.iconURL() || null })
            .setTimestamp()

        if (!ordrsChannel) {
            var logEmbed = await client.utils.newEmbed("Error")
                .setDescription("Order Channel not found.")
            client.utils.sendLog(guildId, client, logEmbed);
        } else {
            ordrsChannel.send({ embeds: [embed2] }).catch(err => { });
        }


        //--------------------SEND INFO TO USER--------------------

        const embed = new client.Discord.EmbedBuilder()
            .setTitle("You have received a credit")
            .setColor(guilds[guildId]["data"]["queue_embed_color"] || 0x00FF00)
            .setDescription("You have successfully received the credit.\n⚠️Redeem it with `/redeem`.\n")
            .setThumbnail(client.server.iconURL() || "")
            .addFields([
                { name: "Credit given", value: "```" + amount + "```", inline: true },
            ])
            .setTimestamp()

        user.send({ embeds: [embed] }).catch((err) => {
            interaction.followUp({ content: "I couldn't send the key to the user.", ephemeral: true });
        });

        setTimeout(function () {
            client.utils.BankEmbedUpdate(client);
        }, 2500);


    },
};