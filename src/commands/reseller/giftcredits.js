const { SlashCommandBuilder, InteractionCollector } = require('discord.js');
const fs = require('fs');

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('giftcredits')
        .setDescription('Gift your credits another user!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Gift credits to this user.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Gift amount to this user in cents.')
                .setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (1 > amount) {
            return interaction.editReply({ content: '`✖️` Not a valid amount!', ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.editReply({ content: 'You cannot gift your own credits!', ephemeral: true });
        }
        if (user.bot) {
            return interaction.editReply({ content: 'You cannot gift a bot\'s credits!', ephemeral: true });
        }

        var credits = JSON.parse(fs.readFileSync("./src/data/credits.json"));

        if (credits[interaction.guild.id][interaction.user.id] === undefined) {
            return interaction.editReply({ content: '`✖️` You cannot gift a user\'s credits!\nYou don\'t have enough credits! (' + credits[interaction.guild.id][interaction.user.id] || 0 + ')', ephemeral: true });
        }
        if (amount > credits[interaction.guild.id][interaction.user.id]) {
            return interaction.editReply({ content: '`✖️` You cannot gift a user\'s credits!\nYou don\'t have enough credits! (' + credits[interaction.guild.id][interaction.user.id] + ' credits)', ephemeral: true });
        }

        setTimeout(async () => {
            // ========================= LOG ========================= //
            var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
            var credits = JSON.parse(fs.readFileSync("./src/data/credits.json"));

            var guildId = interaction.guild.id;

            var logEmbed = await client.utils.newEmbed("Gift credits")
                .addFields(
                    { name: "Server", value: `${interaction.guild.name}`, inline: true },
                    { name: "Executor", value: `${interaction.user.username}`, inline: true },
                    { name: "Server balance", value: `${guilds[guildId]['credits']}`, inline: true },
                    { name: "Reseller", value: `<@${guilds[guildId]['allowed_users'][0]}>`, inline: true },
                    { name: "User", value: `${user.username}`, inline: true },
                    { name: "User balance", value: `${credits[guildId][interaction.user.id]}`, inline: true },
                    { name: "User2", value: `${user.username}`, inline: true },
                    { name: "User2 balance", value: `${credits[guildId][user.id]}`, inline: true })
            client.utils.sendLog(client.server.id, client, logEmbed);

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            client.utils.sendLog(client.server.id, client, logEmbed, guilds[client.server.id].data['Gift credits'], 'Gift credits')
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // ========================= LOG ========================= //
        }, 2500)


        credits[interaction.guild.id][user.id] += amount;
        credits[interaction.guild.id][interaction.user.id] -= amount;
        fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4));
        await interaction.editReply({ content: '`✅` Gifted `' + amount + '` credits to `' + user.username + '`!', ephemeral: true });

        client.utils.BankEmbedUpdate(client);
    },
};