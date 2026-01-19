const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('removebalance')
        .setDescription('Remove balance the reseller.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Reseller user.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Remove amount to this user in cents.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        var check = false;
        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        if (1 > amount) {
            return interaction.editReply({ content: '`✖️` Not a valid amount!', ephemeral: true });
        }

        for (var guild of Object.keys(guilds)) {
            if (guilds[guild]['allowed_users'][0] === user.id) {
                //console.log('sus')

                if (guilds[guild].credits >= amount) {
                    guilds[guild].credits -= amount;
                    fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4));
                    check = true;
                }
            }
        }

        if (check == false) {
            await interaction.editReply({ content: '`❌` User not found.', ephemeral: true });
            return;
        } else {

            var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

            var logEmbed = await client.utils.newEmbed("Remove balance")
                .addFields({ name: "User", value: `<@${interaction.user.id}> ||(${interaction.user.id})||`, inline: false })
                .addFields({ name: "User removed bal", value: `<@${user.id}> ||(${user.id})||`, inline: false })
                .addFields({ name: "Amount", value: `${amount}`, inline: false })
                .addFields({ name: "Balance", value: `${kaka[guild].credits || 0}`, inline: false })
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Remove balance'], 'Remove balance')
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            await interaction.editReply({ content: '`✔️` Balance removed.', ephemeral: true });
        }

    }
}