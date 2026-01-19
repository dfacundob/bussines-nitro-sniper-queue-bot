const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('removecredits')
        .setDescription('Remove a credit to the user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Remove credits to this user.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Remove amount to this user in cents.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.reseller_permCheck(interaction, client) == false) return;
        if (client.utils.guild_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const guildId = interaction.guild.id;

        if (1 > amount) {
            return interaction.editReply({ content: '`✖️` Not a valid amount!', ephemeral: true });
        }

        var credits = JSON.parse(fs.readFileSync("./src/data/credits.json"));
        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        if (credits[guildId][user.id] < amount) {
            return interaction.editReply({ content: `\`❌\` You don't have enough credits to remove!\n\n\`💲\` Available credits: \`${credits[guildId][user.id]}\`` });
        }


        //create a new object
        if (!credits[guildId]) {
            credits[guildId] = {}
        }

        if (!credits[guildId][user.id]) {
            credits[guildId][user.id] = 0
            fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4))
        }

        credits[guildId][user.id] -= amount;
        fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4))

        guilds[guildId]['credits'] += amount;
        fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4))

        // ========================= LOG ========================= //
        var logEmbed = await client.utils.newEmbed("Remove Credits")
            .addFields(
                { name: "Server", value: `${interaction.guild.name}`, inline: true },
                { name: "Executor", value: `${interaction.user.username}`, inline: true },
                { name: "Server balance", value: `${guilds[guildId]['credits']}`, inline: true },
                { name: "Reseller", value: `<@${guilds[guildId]['allowed_users'][0]}>`, inline: true },
                { name: "User", value: `${user.username}`, inline: true },
                { name: "User balance", value: `${credits[guildId][user.id]}`, inline: true } )
        client.utils.sendLog(client.server.id, client, logEmbed);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Remove credits'], 'Remove credits')
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // ========================= LOG ========================= //

        interaction.editReply({ content: `\`✔️\` Successfully removed \`${amount}\` credits to \`${user.username}\`` });

        setTimeout(function () {
            client.utils.BankEmbedUpdate(client);
        }, 2500);


    },
};


