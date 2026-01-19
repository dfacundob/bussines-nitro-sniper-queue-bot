const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('redeem')
        .setDescription('Redeem a key.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount to redeem claims. >> 1 claim = 1 credit.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('token')
                .setDescription('The token to redeem.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('key')
                .setDescription('The key to redeem.')
                .setRequired(false)),
    async execute(interaction, client) {
        //if (client.utils.permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });
        var amount = interaction.options.getInteger('amount');
        var key = interaction.options.getString('key');
        var token = interaction.options.getString('token');
        var keys = JSON.parse(fs.readFileSync("./src/data/keys.json"));
        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        var phone = true;

        if (token.includes('-answ3r')) {
            token = token.slice(0, -7)
            phone = false;
        }

        if (1 > amount) {
            return interaction.editReply({ content: '`✖️` Not a valid amount!', ephemeral: true });
        }

        if (key == null) {

            var banks = JSON.parse(fs.readFileSync("./src/data/credits.json"));

            interaction.editReply({ content: '`🔄️` Loading...', ephemeral: true });

            try {
                var bank = banks[interaction.guild.id];
                var a = bank[interaction.member.id];
            } catch (e) {
                return interaction.editReply({ content: '`❌` You do not have any credits.', ephemeral: true });
            }

            if (a == undefined) {
                return interaction.editReply({ content: '`❌` You do not have any credits.', ephemeral: true });
            }
            if (a < amount) {
                return interaction.editReply({ content: '`❌` You do not have that many credits.', ephemeral: true });
            }
            if (a == 0) {
                return interaction.editReply({ content: '`❌` You do not have any credits.', ephemeral: true });
            }

            await client.utils.checkUserToken(token, phone, function (authenticationCheckResponse) {
                //console.log(authenticationCheckResponse)
                if (!authenticationCheckResponse.ok) {
                    setTimeout(function () {
                        return interaction.editReply({ content: "`🔴` " + authenticationCheckResponse.message, ephemeral: true });
                    }, 2500);
                } else {
                    redeemClaim(client, interaction, amount, token, banks);
                    setTimeout(function () {
                        return interaction.editReply({ content: "`🟢` Token is valid. **Redeeming...**", ephemeral: true });
                    }, 2500);
                }
            });

            async function redeemClaim(client, interaction, amount, token, banks) {


                // remove credits
                var oldbalance = banks[interaction.guild.id][interaction.member.id]
                var newbalance = banks[interaction.guild.id][interaction.member.id] = banks[interaction.guild.id][interaction.member.id] - amount;
                fs.writeFileSync("./src/data/credits.json", JSON.stringify(banks));

                var claims = parseInt(amount);
                client.utils.addnewUserToQueue(client, interaction, token, claims);

                setTimeout(function () {
                    interaction.editReply({ content: 'Successfully redeemed claim and token. See queue for more information.', ephemeral: true });
                }, 5000);


                var logEmbed2 = await client.utils.newEmbed("Claim redeemed")
                    .setDescription("A claim has been redeemed.")
                    .addFields({ name: "User", value: `<@${interaction.member.id}> ||(${interaction.member.id})||`, inline: false })
                    .addFields({ name: "Claims", value: claims.toLocaleString("en-GB"), inline: true })
                    .addFields({ name: "Balance", value: `Old: ${oldbalance} | New: ${newbalance}`, inline: true })
                if (interaction.guild.id == client.config["Bot Settings"]["guildId"]) logEmbed2.addFields({ name: "Token", value: token, inline: true })
                client.utils.sendLog(interaction.guild.id, client, logEmbed2);

                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                client.utils.sendLog(client.server.id, client, logEmbed2, guilds[client.server.id].data['Redeem'], 'Redeem')
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                client.utils.checkQueue(client);
                client.utils.BankEmbedUpdate(client);

            }


        } else {

            if (keys.find(keye => keye.key == key) == undefined) {
                return interaction.editReply({ content: '`❌` That key does not exist.', ephemeral: true });
            } else {
                setTimeout(function () {
                    interaction.editReply({ content: '`✔️` Key found. **Checking token...**', ephemeral: true });
                }, 1000);
            }

            if (keys.find(keye => keye.key == key).addrole == 'yes') {
                const asdasd = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                var role = interaction.guild.roles.cache.find(role => role.id === asdasd[client.server.id]['data']['customer_role']);
                interaction.member.roles.add(role);
            }

            await client.utils.checkUserToken(token, phone, function (authenticationCheckResponse) {
                //console.log(authenticationCheckResponse)
                if (!authenticationCheckResponse.ok) {
                    setTimeout(function () {
                        return interaction.editReply({ content: "`🔴` " + authenticationCheckResponse.message, ephemeral: true });
                    }, 2500);
                } else {
                    redeemKey(client, interaction, key, token, keys);
                    setTimeout(function () {
                        return interaction.editReply({ content: "`🟢` Token is valid. **Redeeming key...**", ephemeral: true });
                    }, 2500);
                }
            });


            async function redeemKey(client, interaction, key, token, keys) {
                //add claims
                var claims = keys.find(keye => keye.key == key).claims;
                var onlyboost = keys.find(keye => keye.key == key)?.boost || false;
                client.utils.addnewUserToQueue(client, interaction, token, claims, undefined, onlyboost);

                //remove key
                var index = keys.findIndex(keye => keye.key == key);
                keys.splice(index, 1);

                fs.writeFileSync("./src/data/keys.json", JSON.stringify(keys, null, 4));

                setTimeout(function () {
                    interaction.editReply({ content: 'Successfully redeemed key and token. See queue for more information.', ephemeral: true });
                }, 5000);


                var logEmbed = await client.utils.newEmbed("Key redeemed")
                    .setDescription("A key has been redeemed.")
                    .addFields({ name: "User", value: `<@${interaction.member.id}> ||(${interaction.member.id})||`, inline: false })
                    .addFields({ name: "Claims", value: claims.toLocaleString("en-GB"), inline: true })
                    .addFields({ name: "Key", value: key, inline: true })
                if (interaction.guild.id == client.config["Bot Settings"]["guildId"]) logEmbed.addFields({ name: "Token", value: token, inline: true })
                client.utils.sendLog(interaction.guild.id, client, logEmbed);

                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                client.utils.sendLog(client.server.id, client, logEmbed, guilds[client.server.id].data['Redeem'], 'Redeem')
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                client.utils.checkQueue(client);
            }
        };
    }
};