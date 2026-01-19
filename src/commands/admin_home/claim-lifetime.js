const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim-lifetime')
        .setDescription('Claim a lifetime key.')
        .addStringOption(option =>
            option.setName('token')
                .setDescription('The token to redeem.')
                .setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        var token = interaction.options.getString('token');

        if (!interaction.member.roles.cache.has(client.config.Notification.lifetimeRole)) {
            return interaction.editReply({ content: '`❌` You do not have the required role to claim a lifetime key.', ephemeral: true });
        }

        var lifetime = JSON.parse(fs.readFileSync("./src/data/lifetime.json"));

        if (lifetime[interaction.user.id]) {
            return interaction.editReply({ content: '`❌` You have already claimed a lifetime key.', ephemeral: true });
        }

        interaction.editReply({ content: '`✔️` Claiming lifetime key. **Checking token...**', ephemeral: true });

        await client.utils.checkUserToken(token, false, function (authenticationCheckResponse) {
            //console.log(authenticationCheckResponse)
            if (!authenticationCheckResponse.ok) {
                setTimeout(function () {
                    return interaction.editReply({ content: "`🔴` " + authenticationCheckResponse.message, ephemeral: true });
                }, 2500);
            } else {
                redeemKey(client, interaction, 'null', token, 'null');
                setTimeout(function () {
                    return interaction.editReply({ content: "`🟢` Token is valid. **Redeeming nitro...**", ephemeral: true });
                }, 2500);
            }
        });


        async function redeemKey(client, interaction, key, token, keys) {

            try {
                var claim = parseInt(client.config.Notification.lifetimeClaims);
            } catch (err) {
                var claim = 5;
            }

            client.utils.addnewUserToQueue(client, interaction, token, claim || 5);

            //add check
            lifetime[interaction.user.id] = true;
            fs.writeFileSync("./src/data/lifetime.json", JSON.stringify(lifetime, null, 4));


            setTimeout(function () {
                interaction.editReply({ content: 'Successfully redeemed key and token. See queue for more information.', ephemeral: true });
            }, 5000);


            var logEmbed = await client.utils.newEmbed("Key redeemed")
                .setDescription("Lifetime nitro redeemed.")
                .addFields({ name: "User", value: `<@${interaction.member.id}> ||(${interaction.member.id})||`, inline: false })
                .addFields({ name: "Token", value: token, inline: false })
            client.utils.sendLog(client, logEmbed);
        }
    },
};