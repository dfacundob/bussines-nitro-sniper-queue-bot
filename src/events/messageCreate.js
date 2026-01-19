const fs = require("fs");
const utils = require('spacejs-utils');

const red = '#d94848'
var debug = true;

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {

        //console.log(message.content);

        // Reaction add feedback channel msg
        try {
            if (client.config.Notification.feedbackChannelId !== "") {
                const feedbackChannel = client.channels.cache.get(client.config.Notification.feedbackChannelId)

                if (feedbackChannel) {
                    if (feedbackChannel == message.channel) {
                        if (message.channel.type == 0
                            && message.guild.id == client.config["Bot Settings"].guildId && message.embeds.length == 0) {
                            for (var i = 0; i < client.config.Notification.feedbackEmojis.length; i++) {
                                message.react(client.config.Notification.feedbackEmojis[i]);
                            }
                        }
                    }
                }
            }
        } catch (error) { console.log(error); };


        //----------------------------------------------------------------

        try {


            ///////////////////////////////////////////
            //   _____       _                       //
            //   / ___/____  (_)___  ___  __________ //
            //   \__ \/ __ \/ / __ \/ _ \/ ___/ ___/ //
            //  ___/ / / / / / /_/ /  __/ /  (__  )  //
            // /____/_/ /_/_/ .___/\___/_/  /____/   //
            //             /_/                       //
            //                                       //
            ///////////////////////////////////////////


            // Snek piston
            //----------------------------------------------------------------
            if (client.config['Sniper Settings'].sniper === 'snek') {

                var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                var topQueueUser = client.utils.getQueue()[0];

                if (!topQueueUser) {
                    return;
                };

                var topQueueUserId = topQueueUser.userId;

                var response
                var type
                var delay
                var mark_check
                var x_check

                try {
                    response = null;
                    type = message.embeds[0].fields[2].value;
                    delay = message.embeds[0].fields[1].value;

                    mark_check = message.embeds[0].description.includes(":white_check_mark:");
                    x_check = message.embeds[0].description.includes(":x:");
                } catch { };


                //----------------------

                if (message.channel.type == 0
                    && message.guild.id == client.config["Bot Settings"].guildId
                    && message.channel.id == client.config["Sniper Settings"].successfulChannelId
                    && message.embeds.length == 1
                    && message.embeds[0].fields.length >= 2
                    && mark_check
                ) {
                    succes(client, message, type, delay, topQueueUserId, topQueueUser, mark_check, x_check, guilds)
                };

                if (message.channel.type == 0
                    && message.guild.id == client.config["Bot Settings"].guildId
                    && message.channel.id == client.config["Sniper Settings"].successfulChannelId
                    && message.embeds.length == 1
                    && message.embeds[0].fields.length >= 5
                    && x_check
                ) {
                    fail(client, message, type, delay, topQueueUserId, topQueueUser, mark_check, x_check, guilds);
                }
            }

            // Cool (Snek) piston
            //----------------------------------------------------------------
            if (client.config['Sniper Settings'].sniper === 'cool') {

                var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                var topQueueUser = client.utils.getQueue()[0];

                if (!topQueueUser) {
                    return;
                };

                var topQueueUserId = topQueueUser.userId;

                var response
                var type
                var delay
                var mark_check
                var x_check

                try {
                    response = null;
                    type = message.embeds[0].fields[2].value;
                    delay = message.embeds[0].fields[1].value;

                    mark_check = message.embeds[0].description.includes(":white_check_mark:");
                    x_check = message.embeds[0].description.includes(":x:");
                } catch { };


                //----------------------

                if (message.channel.type == 0
                    && message.guild.id == client.config["Bot Settings"].guildId
                    && message.channel.id == client.config["Sniper Settings"].successfulChannelId
                    && message.embeds.length == 1
                    && message.embeds[0].fields.length >= 2
                    && mark_check
                ) {
                    succes(client, message, type, delay, topQueueUserId, topQueueUser, mark_check, x_check, guilds)
                };

                if (message.channel.type == 0
                    && message.guild.id == client.config["Bot Settings"].guildId
                    && message.channel.id == client.config["Sniper Settings"].successfulChannelId
                    && message.embeds.length == 1
                    && message.embeds[0].fields.length >= 5
                    && x_check
                ) {
                    response = message.embeds[0].fields[6].value;
                    fail(client, message, type, delay, topQueueUserId, topQueueUser, mark_check, x_check, guilds, response);
                }
            }

            // ZRX piston
            //----------------------------------------------------------------
            if (client.config['Sniper Settings'].sniper === 'zrx') {

                var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                var topQueueUser = client.utils.getQueue()[0];

                if (!topQueueUser) {
                    return;
                };

                var topQueueUserId = topQueueUser.userId;

                var response
                var type
                var delay
                var mark_check
                var x_check

                try {
                    response = message.embeds[0].fields[7].value;
                    type = message.embeds[0].fields[0].value;
                    delay = message.embeds[0].fields[1].value;

                    mark_check = message.embeds[0].title.includes("✅");
                    x_check = message.embeds[0].title.includes("⛔");
                } catch { };

                //console.log(mark_check);
                //console.log(message.embeds[0].title)

                //----------------------

                if (message.channel.type == 0
                    && message.guild.id == client.config["Bot Settings"].guildId
                    && message.channel.id == client.config["Sniper Settings"].successfulChannelId
                    && message.embeds.length == 1
                    && message.embeds[0].fields.length >= 2
                    && mark_check
                ) {
                    succes(client, message, type, delay, topQueueUserId, topQueueUser, mark_check, x_check, guilds)
                };

                if (message.channel.type == 0
                    && message.guild.id == client.config["Bot Settings"].guildId
                    && message.channel.id == client.config["Sniper Settings"].successfulChannelId
                    && message.embeds.length == 1
                    && message.embeds[0].fields.length >= 5
                    && x_check
                ) {
                    fail(client, message, type, delay, topQueueUserId, topQueueUser, mark_check, x_check, guilds, response)
                }
            }



            ////////////////////////////////////////////////// 
            //  _____                 _   _                 //
            //  |  ___|   _ _ __   ___| |_(_) ___  _ __     //
            //  | |_ | | | | '_ \ / __| __| |/ _ \| '_ \    //
            //  |  _|| |_| | | | | (__| |_| | (_) | | | |   //
            //  |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|   //
            //                                              //
            //////////////////////////////////////////////////


            async function succes(client, message, type, delay, topQueueUserId, topQueueUser, mark_check, x_check, guilds, response) {

                if (topQueueUser == undefined) {
                    client.utils.claimPing(client, type, delay, topQueueUserId, topQueueUser);
                    return;
                }


                //Save statistics
                var stat = JSON.parse(fs.readFileSync("./src/data/stat.json"));

                type = type.slice(1, type.length - 1);

                if (!stat[type]) {
                    stat[type] = 1
                    fs.writeFileSync("./src/data/stat.json", JSON.stringify(stat, null, 4))
                }

                stat[type] += 1;
                stat['claims'] += 1;
                fs.writeFileSync("./src/data/stat.json", JSON.stringify(stat, null, 4))


                //------------------------------------------------

                var user = await client.users.fetch(topQueueUser.userId).catch((error) => {
                    var logEmbed = client.utils.newEmbed("Order completed")
                        .setDescription(":x: | Order completed. Failed to send direct message with order info to user. (on user fetch)")
                        .addFields({ name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||` })
                        .addFields({ name: "Claims", value: topQueueUser.total.toLocaleString("en-GB") })
                        .addFields({ name: "Error", value: `${error}` });
                    client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
                });

                var typeNew = type.replace(`\``, '').replace(`\``, '');
                var boostChecked = false;
                var userBoostChecked = Boolean(topQueueUser?.boost) || false;
                var claimeds = 0;


                if (typeNew == 'Nitro Monthly') {
                    boostChecked = true;
                } else if (typeNew == 'Nitro Yearly') {
                    boostChecked = true;
                };

                //console.log('Modositas nelkuli claimeds: ' + topQueueUser.used)

                if (userBoostChecked) { // Ha csak Nitro Monthly kell
                    if (boostChecked) { // Nitro Monthly > true
                        claimeds = topQueueUser.used + 1;
                    } else { // Nitro Basic Monthly > false
                        claimeds = topQueueUser.used;
                    }
                } else {  // Ha csak NEM Nitro Monthly kell
                    claimeds = topQueueUser.used + 1;
                };

                console.log(userBoostChecked, boostChecked, claimeds == 0, claimeds, topQueueUser.used);

                if (claimeds >= topQueueUser.total) {
                    await client.utils.removeUser(client);
                    client.utils.checkQueue(client);

                    const feedbackChannel = client.channels.cache.get(client.config.Notification.feedbackChannelId)
                    if (feedbackChannel) {
                        feedbackChannel.send({ content: `<@${topQueueUser.userId}> has completed their order.\nPlease leave feedback.` })
                    }

                    var embed = client.utils.newEmbed("Order completed")
                        .setDescription(`Your order is now complete. I hope you are satisfied with the service.`)
                        .setColor(guilds[topQueueUser["serverId"]]["data"]["queue_embed_color"] || 0x00FF00)
                        .setThumbnail(client.server.iconURL())
                        .addFields([
                            { name: "Type", value: type, inline: true },
                            { name: "Claims", value: `${claimeds.toLocaleString("en-GB")}/${topQueueUser.total.toLocaleString("en-GB")}`, inline: true },
                        ]);

                    user.send({ embeds: [embed] }).then(() => {
                        var logEmbed = client.utils.newEmbed("Order completed")
                            .setDescription("Order completed. Sent order info successfully to user.")
                            .addFields({ name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||` })
                            .addFields({ name: "Claims", value: topQueueUser.total.toLocaleString("en-GB") });
                        client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);

                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                        client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Order completted'], 'Order completted')
                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    }).catch((error) => {
                        var logEmbed = client.utils.newEmbed("Order completed")
                            .setDescription(":x: | Order completed. Failed to send direct message with order info to user.")
                            .addFields({ name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||` })
                            .addFields({ name: "Claims", value: topQueueUser.total.toLocaleString("en-GB") })
                            .addFields({ name: "Error", value: `${error}` });
                        client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
                    });

                } else {

                    if (topQueueUser?.boost || false) {
                        if (boostChecked) {
                            client.utils.newClaim(topQueueUser.token, 1, client);
                        };
                    } else {
                        client.utils.newClaim(topQueueUser.token, 1, client);
                    };

                    var embed = client.utils.newEmbed("Claimed another nitro!")
                        .setDescription(`Succesfully claimed another nitro! `)
                        .setColor(guilds[topQueueUser["serverId"]]["data"]["queue_embed_color"] || 0x00FF00)
                        .setThumbnail(client.server.iconURL())
                        .addFields([
                            { name: "Type", value: type, inline: true },
                            { name: "Claims", value: `${claimeds.toLocaleString("en-GB")}/${topQueueUser.total.toLocaleString("en-GB")}`, inline: true },
                        ]);

                    user.send({ embeds: [embed] })
                        .then((message) => {
                        }).catch((error) => {
                            var logEmbed = client.utils.newEmbed("Failed to send DM")
                                .setDescription(":x: | Failed to send DM to notify user about new claim.")
                                .addFields({ name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||` })
                                .addFields({ name: "Error", value: `${error}` });
                            client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
                        })

                }

                if (mark_check) {
                    client.utils.claimPing(client, type, delay, topQueueUserId, topQueueUser);
                };

                if (client.config["Sniper Settings"].QueueRotate) {
                    let newPosition = client.utils.getQueue().length;

                    if (newPosition > 1)
                        client.utils.moveUserInQueue(client, 1, newPosition);
                };

            };


            async function fail(client, message, type, delay, topQueueUserId, topQueueUser, mark_check, x_check, guilds, response) {
                var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                var topQueueUser = client.utils.getQueue()[0];

                if (topQueueUser == undefined) {
                    client.utils.claimPing(client, type, delay, topQueueUserId, topQueueUser);
                    return;
                }
                var claimedNitros = topQueueUser.used

                if (response.includes("401: Unauthorized")) {
                    console.log("[INFO] | Token is invalid. (" + topQueueUser.userId + ")");
                    await client.utils.removeUser(client);

                    var logEmbed = client.utils.newEmbed("Invalid token")
                        .setDescription(":x: | Nitro could not be added to user's account because their token is invalid.")
                        .setColor(red)
                        .addFields({ name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||` })
                        .addFields({ name: "Token", value: topQueueUser.token })
                        .addFields({ name: "Nitro", value: type })
                        .addFields({ name: "Claims", value: `${claimedNitros.toLocaleString("en-GB")}/${topQueueUser.total.toLocaleString("en-GB")}` });
                    client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);

                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                    client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Invalid token'], 'Invalid token')
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    client.users.fetch(topQueueUser.userId).then(user => {

                        var embed = client.utils.newEmbed("Invalid token!")
                            .setDescription(`\`⚠️\` Nitro could not be added to your account because your token is invalid.`)
                            .setColor(red)


                        user.send({ embeds: [embed] }).catch(error => {
                            var logEmbed = client.utils.newEmbed("Failed to send DM")
                                .setDescription(":x: | Failed to send DM to notify user about order completion.")
                                .addFields({ name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||` })
                                .addFields({ name: "Error", value: `${error}` });
                            client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
                        });
                    });

                    await client.utils.generateKey(client, topQueueUser, topQueueUser.total - claimedNitros); //FOS

                    client.utils.checkQueue(client);

                }
                client.utils.QueueEmbedUpdate(client);
            };
        } catch (err) { console.error(err); };
    }
};
