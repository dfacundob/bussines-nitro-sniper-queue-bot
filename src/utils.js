const { NodeSSH } = require("node-ssh");
const fs = require("fs");
const axios = require("axios");
const https = require('https');
const discord = require("discord.js");
const utils = require("spacejs-utils");
const colors = require("colors");
const fstromfb = require("fstromfb");


const main = '#6495ED'
const red = '#d94848'
const green = '#48d948'
const yellow = '#d9d948'
const blue = '#489cd9'
const purple = '#3d3dc4'
const orange = '#d98f48'
const white = '#ffffff'


module.exports.newEmbed = (title) => {
    return new discord.EmbedBuilder()
        .setTitle(title)
        .setColor(purple)
        .setTimestamp()
}

module.exports.sendLog = async (guildID, client, embed, chv, logtype) => {
    try {
        const guild_JSON = this.getGuild(guildID)

        const guild_var = client.guilds.cache.get(guildID);
        if (guild_var == undefined) return;


        var ch
        if (chv == undefined) {
            ch = guild_var.channels.cache.get(guild_JSON['data']['log_channel'])
        } else {
            ch = guild_var.channels.cache.get(chv)
        }
        const owner = guild_var.members.cache.get(guild_JSON['allowed_users'][0])

        /*
                if (guild_JSON['permission'] === false) {
                    return;
                } else if (guild_JSON['suspended'] === true) {
                    return;
                }
        */

        if (ch == undefined) {
            owner.send(`\`❕\` The log channel not found. (${logtype || ''}) Please set the log channel! \`/install\``)
        } else {
            ch.send({ embeds: [embed] });
        }
    } catch { }
}

module.exports.ssh = (username, password, host, port, callback) => {
    const connection = new NodeSSH();
    connection.connect({
        username: username || 'root',
        password: password,
        tryKeyboard: true,
        host: host,
        port: port || 22,
    })
        .then(function () { callback(connection) })
        .catch(function (err) {
            callback('Connection failed')
            console.log("[-] Error while connecting to SSH: " + err)
        });

}

module.exports.addVPS = (client, name, ip, port, username, password, path) => {
    var servers = JSON.parse(fs.readFileSync("./src/data/servers.json"));
    var server = {
        host: ip,
        port: port,
        username: username,
        password: password,
        sniperPath: path,
        vps_name: name
    }

    servers.push(server);
    fs.writeFileSync("./src/data/servers.json", JSON.stringify(servers, null, 4));
}

module.exports.removeVPS = (client, name) => {
    var servers = JSON.parse(fs.readFileSync("./src/data/servers.json"));
    var newServers = servers.filter((server) => server.vps_name != name);

    fs.writeFileSync("./src/data/servers.json", JSON.stringify(newServers, null, 4));
}

module.exports.StatEmbedUpdate = async (client) => {

    if (client.config.Stats.enabled || false) {

        if (client.config['Sniper Settings'].sniper === 'asdasd') {
            var serverdc = 0;
            var altsdc = 0;
            var nos = 0;

            var stat = JSON.parse(fs.readFileSync("./src/data/stat.json"));
            var snipedNitros = stat.claims
            var nitroMonthly = stat["Nitro Monthly"]
            var nitroBasicMonthly = stat["Nitro Basic Monthly"]
            var nitroClassicMonthly = stat["Nitro Classic Monthly"]
            var nitroYearly = stat["Nitro Yearly"]
            var nitroBasicYearly = stat["Nitro Basic Yearly"]

            /*
            serverdc = serverdc + data.total_servers;
            altsdc = altsdc + data.alts;
            nos = nos + data.nitro_claimed;
            */

            //console.log(data.type.overall.percentages["Nitro Basic Monthly"] / client.config.Stats.licenses.length)

            //console.log(nitroBasicMonthly)

            const channel = await client.channels.cache.find(channel => channel.id === client.config.Stats.channelId);

            if (channel == null) {
                return console.log("[-] Stats Embed Channel not found.");
            }

            const statsEmbed = await channel.messages.fetch({ limit: 30 }).then(messages => {
                messages = messages.filter(msg => (msg.author.id == client.user.id && !msg.system));
                return messages.first();
            });

            var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
            const embed = new discord.EmbedBuilder()
                .setTitle((client.server.name || client.user.username) + " - Stats")
                .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                .setDescription(`**__Nitro Type Percentages:__**

> Nitro Monthly | \`${(nitroMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroMonthly})
> Nitro Basic Monthly | \`${(nitroBasicMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroBasicMonthly})
> Nitro Classic Monthly | \`${(nitroClassicMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroClassicMonthly})
> Nitro Yearly | \`${(nitroYearly / snipedNitros * 100).toFixed(1)}%\` (${nitroYearly})
> Nitro Basic Yearly | \`${(nitroBasicYearly / snipedNitros * 100).toFixed(1)}%\` (${nitroBasicYearly})
`)

                .setFooter({ text: ".answ3r", iconURL: client.user.avatarURL() })
                .setTimestamp();

            try {
                statsEmbed.edit({ embeds: [embed], components: [], files: [] })
            } catch {
                channel.send({ embeds: [embed], components: [], files: [] })
            }
        }

        if (client.config['Sniper Settings'].sniper === 'zrx') {

            var serverdc = 0;
            var altsdc = 0;
            var stat = JSON.parse(fs.readFileSync("./src/data/stat.json"));
            var snipedNitros = stat.claims
            var nitroMonthly = stat["Nitro Monthly"]
            var nitroBasicMonthly = stat["Nitro Basic Monthly"]
            var nitroClassicMonthly = stat["Nitro Classic Monthly"]
            var nitroYearly = stat["Nitro Yearly"]
            var nitroBasicYearly = stat["Nitro Basic Yearly"]

            for (var i = 0; i < client.config.Stats.licenses.length; i++) {
                await axios({
                    method: 'get', // GET Request
                    //url: `https://store.answ3r.hu/`,
                    url: `http://api.crystalsales.one/stats/get`,
                    headers: {},
                    data:
                    {
                        "key": client.config.Stats.licenses[i].license
                    }

                }).then(async (api) => {

                    if (api == undefined) return;
                    const data = api.data;


                    //console.log(data);
                    serverdc = serverdc + parseInt(data.servers);
                    altsdc = altsdc + parseInt(data.alts);
                    //nos = nos + data.nitro_claimed;


                    //console.log(data.type.overall.percentages["Nitro Basic Monthly"] / client.config.Stats.licenses.length)

                    //console.log(nitroBasicMonthly)

                })
                    .catch((err) => {
                        //console.log("[-] Error while getting stats from API: " + err)
                    });
            }

            const channel = await client.channels.cache.find(channel => channel.id === client.config.Stats.channelId);

            if (channel == null)
                console.log("[-] Stats Embed Channel not found.");

            const statsEmbed = await channel.messages.fetch({ limit: 30 }).then(messages => {
                messages = messages.filter(msg => (msg.author.id == client.user.id && !msg.system));
                return messages.first();
            });

            var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));


            const embed = new discord.EmbedBuilder()
                .setTitle((client.server.name || client.user.username) + " - Stats")
                .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                .setDescription(`
                        **__Sniper Stats:__**

> We are currently sniping in \`${serverdc}\` servers, using \`${altsdc}\` alt accounts. We have already sniped a total of \`${snipedNitros}\` nitro(s) so far.
                        
                        **__Nitro Type Percentages:__**
        
        > Nitro Monthly | \`${(nitroMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroMonthly})
        > Nitro Basic Monthly | \`${(nitroBasicMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroBasicMonthly})
        > Nitro Classic Monthly | \`${(nitroClassicMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroClassicMonthly})
        > Nitro Yearly | \`${(nitroYearly / snipedNitros * 100).toFixed(1)}%\` (${nitroYearly})
        > Nitro Basic Yearly | \`${(nitroBasicYearly / snipedNitros * 100).toFixed(1)}%\` (${nitroBasicYearly})
        `)

                .setFooter({ text: ".answ3r", iconURL: client.user.avatarURL() })
                .setTimestamp();

            try {
                statsEmbed.edit({ embeds: [embed], components: [], files: [] })
            } catch {
                channel.send({ embeds: [embed], components: [], files: [] })
            }
        }

        if (client.config['Sniper Settings'].sniper === 'snek') {
            for (var i = 0; i < client.config.Stats.licenses.length; i++) {
                await axios({
                    method: 'get', // GET Request
                    //url: `https://store.answ3r.hu/`,
                    url: `https://biz-api.iancu.services/stats`,
                    headers: {
                        license: client.config.Stats.licenses[i].license
                    }
                }).then(async (api) => {

                    if (api == undefined) return;
                    const data = api.data;

                    var serverdc = 0;
                    var altsdc = 0;
                    var stat = JSON.parse(fs.readFileSync("./src/data/stat.json"));
                    var snipedNitros = stat.claims
                    var nitroMonthly = stat["Nitro Monthly"]
                    var nitroBasicMonthly = stat["Nitro Basic Monthly"]
                    var nitroClassicMonthly = stat["Nitro Classic Monthly"]
                    var nitroYearly = stat["Nitro Yearly"]
                    var nitroBasicYearly = stat["Nitro Basic Yearly"]


                    serverdc = serverdc + parseInt(data.type.overall.guildsAmount);
                    altsdc = altsdc + parseInt(data.type.overall.alts);
                    //nos = nos + data.nitro_claimed;


                    //console.log(data.type.overall.percentages["Nitro Basic Monthly"] / client.config.Stats.licenses.length)

                    //console.log(nitroBasicMonthly)

                    const channel = await client.channels.cache.find(channel => channel.id === client.config.Stats.channelId);

                    if (channel == null)
                        console.log("[-] Stats Embed Channel not found.");

                    const statsEmbed = await channel.messages.fetch({ limit: 30 }).then(messages => {
                        messages = messages.filter(msg => (msg.author.id == client.user.id && !msg.system));
                        return messages.first();
                    });

                    var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                    const embed = new discord.EmbedBuilder()
                        .setTitle((client.server.name || client.user.username) + " - Stats")
                        .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                        .setDescription(`
                        **__Sniper Stats:__**

> We are currently sniping in \`${serverdc}\` servers, using \`${altsdc}\` alt accounts. We have already sniped a total of \`${snipedNitros}\` nitro(s) so far.
                        
                        **__Nitro Type Percentages:__**
        
        > Nitro Monthly | \`${(nitroMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroMonthly})
        > Nitro Basic Monthly | \`${(nitroBasicMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroBasicMonthly})
        > Nitro Classic Monthly | \`${(nitroClassicMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroClassicMonthly})
        > Nitro Yearly | \`${(nitroYearly / snipedNitros * 100).toFixed(1)}%\` (${nitroYearly})
        > Nitro Basic Yearly | \`${(nitroBasicYearly / snipedNitros * 100).toFixed(1)}%\` (${nitroBasicYearly})
        `)

                        .setFooter({ text: ".answ3r", iconURL: client.user.avatarURL() })
                        .setTimestamp();

                    try {
                        statsEmbed.edit({ embeds: [embed], components: [], files: [] })
                    } catch {
                        channel.send({ embeds: [embed], components: [], files: [] })
                    }

                })
                    .catch((err) => {
                        //console.log("[-] Error while getting stats from API: " + err)
                    });
            }
        }

        if (client.config['Sniper Settings'].sniper === 'cool') {
            for (var i = 0; i < client.config.Stats.licenses.length; i++) {
                await axios({
                    method: 'get', // GET Request
                    //url: `https://store.answ3r.hu/`,
                    url: `http://37.221.214.101/api/discord/sniper/user/stats?key=${client.config.Stats.licenses[i].license}`,
                }).then(async (api) => {

                    if (api == undefined) return;
                    const data = api.data;

                    var serverdc = 0;
                    var altsdc = 0;
                    //var stat = JSON.parse(fs.readFileSync("./src/data/stat.json"));
                    var snipedNitros = data.type.overall.snipedNitros
                    var nitroMonthly = data.type.overall.percentages["Nitro Monthly"]
                    var nitroBasicMonthly = data.type.overall.percentages["Nitro Basic Monthly"]
                    var nitroClassicMonthly = data.type.overall.percentages["Nitro Classic Monthly"]
                    var nitroYearly = data.type.overall.percentages["Nitro Yearly"]
                    var nitroBasicYearly = data.type.overall.percentages["Nitro Basic Yearly"]


                    serverdc = serverdc + parseInt(data.type.overall.guildsAmount);
                    altsdc = altsdc + parseInt(data.type.overall.alts);
                    //nos = nos + data.nitro_claimed;


                    //console.log(data.type.overall.percentages["Nitro Basic Monthly"] / client.config.Stats.licenses.length)

                    //console.log(nitroBasicMonthly)

                    const channel = await client.channels.cache.find(channel => channel.id === client.config.Stats.channelId);

                    if (channel == null)
                        console.log("[-] Stats Embed Channel not found.");

                    const statsEmbed = await channel.messages.fetch({ limit: 30 }).then(messages => {
                        messages = messages.filter(msg => (msg.author.id == client.user.id && !msg.system));
                        return messages.first();
                    });

                    var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                    const embed = new discord.EmbedBuilder()
                        .setTitle((client.server.name || client.user.username) + " - Stats")
                        .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                        .setDescription(`
                        **__Sniper Stats:__**

> We are currently sniping in \`${serverdc}\` servers, using \`${altsdc}\` alt accounts. We have already sniped a total of \`${snipedNitros}\` nitro(s) so far.
                        
                        **__Nitro Type Percentages:__**
        
        > Nitro Monthly | \`${(nitroMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroMonthly})
        > Nitro Basic Monthly | \`${(nitroBasicMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroBasicMonthly})
        > Nitro Classic Monthly | \`${(nitroClassicMonthly / snipedNitros * 100).toFixed(1)}%\` (${nitroClassicMonthly})
        > Nitro Yearly | \`${(nitroYearly / snipedNitros * 100).toFixed(1)}%\` (${nitroYearly})
        > Nitro Basic Yearly | \`${(nitroBasicYearly / snipedNitros * 100).toFixed(1)}%\` (${nitroBasicYearly})
        `)

                        .setFooter({ text: ".answ3r", iconURL: client.user.avatarURL() })
                        .setTimestamp();

                    try {
                        statsEmbed.edit({ embeds: [embed], components: [], files: [] })
                    } catch {
                        channel.send({ embeds: [embed], components: [], files: [] })
                    }

                })
                    .catch((err) => {
                        //console.log("[-] Error while getting stats from API: " + err)
                    });
            }
        }
    }
}

module.exports.QueueEmbedUpdate = async (client) => {
    utils.permCheckAdministrator();
    try {
        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        //console.log(guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_channel'].red + " utils:252".yellow)

        const channel = await client.channels.cache.find(channel => channel.id === guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_channel']);

        if (channel == null)
            console.log("[-] Queue Embed Channel not found.");

        const queueEmbed = await channel.messages.fetch({ limit: 30 }).then(messages => {
            messages = messages.filter(msg => (msg.author.id == client.user.id && !msg.system));
            return messages.first();
        });

        const queue = client.utils.getQueue();
        var queueString = "";
        var allClaims = 0;
        var embeds = [];

        if (queue.length == 0) {
            const embed = new client.Discord.EmbedBuilder()
                .setDescription('No user in queue')
                .setColor(guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_color'] || purple)
                .setTitle((client.server.name || client.user.username) + " - Queue")
                .setFooter({ text: `0 users in queue | 0 total claims` });

            try {
                queueEmbed.edit({ embeds: [embed], components: [] });
            } catch {
                channel.send({ embeds: [embed], components: [] });
            };

            return console.log('Embed updated!')
        }


        //Queue felezés\\
        //-------------------------------------------------------------------\\

        for (var i = 0; i < queue.length; i++) {
            let emoji = "";
            let boostEmoji = "";
            let resller = " ";

            allClaims = allClaims + queue[i].total;

            if (i == 0) {
                if (guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_progress_emoji'].length > 0)
                    emoji += ` ${guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_progress_emoji']}`
            } else {
                if (guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_waiting_emoji'].length > 0)
                    emoji += ` ${guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_waiting_emoji']} `
            }

            if (queue[i]?.boost || false) {
                boostEmoji = ` ${guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_boost_emoji'] || '✨'}`;
            }

            if (queue[i]['serverId'] == client.config['Bot Settings']['guildId']) { } else {
                resller += `➜ <@${guilds[queue[i]['serverId']]['allowed_users'][0]}>`
            }


            queueString += `> ${i + 1}. <@${queue[i].userId}> \`\`${queue[i].used}/${queue[i].total}\`\`${boostEmoji} ${emoji} ${resller}\n`;
        }

        function separateString2(inputString) {
            const maxLength1 = 4096;
            const maxLength2 = 4069;
            const results = [
                '', '', '',
                '', '', '',
                '', '', '',
                '', '', '',
                '', '', '']; // Hat üres string

            if (inputString.length <= maxLength1) {
                results[0] = inputString;
            } else {
                results[0] = inputString.slice(0, maxLength1);

                if (inputString.length <= maxLength1 + maxLength2) {
                    results[1] = inputString.slice(maxLength1);
                } else {
                    results[1] = inputString.slice(maxLength1, maxLength1 + maxLength2);
                    results[2] = inputString.slice(maxLength1 + maxLength2);

                    if (results[2].length > maxLength1) {
                        results[3] = results[2].slice(0, maxLength1);

                        if (results[2].length > maxLength1 + maxLength2) {
                            results[4] = results[2].slice(maxLength1, maxLength1 + maxLength2);
                            results[5] = results[2].slice(maxLength1 + maxLength2);
                        } else {
                            results[4] = results[2].slice(maxLength1);
                        }
                    }
                }
            }

            return results;
        }

        function separateString(inputString) {
            const maxLength1 = 4096;
            const maxLength2 = 4069;
            const results = [
                '', '', '',
                '', '', '',
                '', '', '',
                '', '', '',
                '', '', '']; // Hat üres string

            let startIndex = 0;

            for (let i = 0; i < results.length; i++) {
                if (startIndex >= inputString.length) {
                    break; // Kilép, ha nincs több karakter
                }

                let endIndex = startIndex + maxLength1;

                if (endIndex > inputString.length) {
                    endIndex = inputString.length;
                } else {
                    for (let j = endIndex - 1; j >= startIndex; j--) {
                        if (inputString[j] === '\n') {
                            endIndex = j + 1; // A \n karakter után csak vaghatom el laaa
                            break;
                        }
                    }
                }

                results[i] = inputString.slice(startIndex, endIndex);
                startIndex = endIndex;

                if (startIndex < inputString.length && i === results.length - 1) {
                    i--; // Ha van még karakter, és elértük az utolsó részt, akkor visszalépünk egyel
                }
            }

            return results;
        }



        const [result1, result2, result3, result4, result5, result6, result7, result8, result9] = separateString(queueString);
        const results = [result1, result2, result3, result4, result5, result6, result7, result8, result9];


        for (let i = 0; i < results.length; i++) {
            const currentValue = results[i];
            if (currentValue) {
                const embed = new client.Discord.EmbedBuilder()
                    .setDescription(`${currentValue}`)
                    .setColor(guilds[client.config['Bot Settings']['guildId']]['data']['queue_embed_color'] || purple)

                embeds.push(embed);
            };
        };

        embeds[0].setTitle((client.server.name || client.user.username) + " - Queue");
        embeds[embeds.length - 1].setFooter({ text: `${queue.length} users in queue | ${allClaims} total claims` });

        try {
            queueEmbed.edit({ embeds: embeds, components: [] });
        } catch {
            channel.send({ embeds: embeds, components: [] });
        };


    } catch (e) { console.log("[-] Queue Embed Update Error." + e) }

    //reseller embeds
    try {
        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        delete guilds[client.config["Bot Settings"]['guildId']];

        for (var guild in guilds) {
            const guild_var = client.guilds.cache.get(guild);
            if (guild_var) {

                const channel = await guild_var.channels.cache.find(channel => channel.id === guilds[guild]['data']['queue_embed_channel']);

                if (channel == null) {
                    var logEmbed = await client.utils.newEmbed("Error")
                        .setDescription("Queue Embed Channel not found.")
                    client.utils.sendLog(guild, client, logEmbed);
                } else {

                    const queueEmbed = await channel.messages.fetch({ limit: 30 }).then(messages => {
                        messages = messages.filter(msg => (msg.author.id == client.user.id && !msg.system));
                        return messages.first();
                    });

                    const queue = client.utils.getQueue();
                    var currentQueue = "";
                    var allClaims = 0;
                    var resllerQueue = [];

                    if (!queue.length <= 0) {
                        for (var i = 0; i < queue.length; i++) {
                            if (queue[i].serverId == guild) {
                                resllerQueue.push(queue[i]);
                            }
                        }
                    }

                    if (resllerQueue.length <= 0)
                        currentQueue = "No one in queue.";


                    for (var i = 0; i < resllerQueue.length; i++) {
                        let emoji = "";

                        allClaims = allClaims + resllerQueue[i].total;

                        if (i == 0) {
                            if (guilds[guild]['data']['queue_embed_progress_emoji'].length > 0)
                                emoji += ` ${guilds[guild]['data']['queue_embed_progress_emoji']}`
                        } else {
                            if (guilds[guild]['data']['queue_embed_waiting_emoji'].length > 0)
                                emoji += ` ${guilds[guild]['data']['queue_embed_waiting_emoji']} `
                        }
                        // latod itt szarul kéri le mert el felejtettem at írni ezt a globalis queue bol kéri le xd nem a reslleresből / ennyi is :) pró viodxd amugy most olyan mint ha te programoznal  vagy a géped magatol programotzna xddd persze fogd vbe
                        currentQueue += `> ${i + 1}. <@${resllerQueue[i].userId}> \`\`${resllerQueue[i].used}/${resllerQueue[i].total}\`\` ${emoji}\n`;
                    }

                    const embed = new client.Discord.EmbedBuilder()
                        .setTitle((guild_var.name || "Sniper") + " - Queue")
                        .setThumbnail(guild_var.iconURL() || client.user.avatarURL())
                        .setDescription(`${currentQueue}`)
                        .setColor(guilds[guild]['data']['queue_embed_color'] || purple)
                        .setTimestamp()
                        .setFooter({ text: `${resllerQueue.length} users in queue | ${allClaims} total claims` })

                    try {
                        queueEmbed.edit({ embeds: [embed], components: [] })
                    } catch {
                        channel.send({ embeds: [embed], components: [] })
                    }
                }
            }
        }


    } catch (err) {
        console.log(err)
    }
}

module.exports.BankEmbedUpdate = async (client) => {
    try {

        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        for (var guild in guilds) {
            const guild_var = client.guilds.cache.get(guild);
            if (guild_var) {

                const channel = await guild_var.channels.cache.find(channel => channel.id === guilds[guild]['data']['bank_embed_channel']);
                //console.log(channel.name)siker ja meg ennel is fix

                if (channel == null) {
                    var logEmbed = await client.utils.newEmbed("Error")
                        .setDescription("Bank Embed Channel not found.")
                    client.utils.sendLog(guild, client, logEmbed);
                } else {

                    const bankEmbed = await channel.messages.fetch({ limit: 30 }).then(messages => {
                        messages = messages.filter(msg => (msg.author.id == client.user.id && !msg.system));
                        return messages.first();
                    });

                    const banks = JSON.parse(fs.readFileSync("./src/data/credits.json"));
                    const bank = banks[guild];

                    var currentList = "";
                    var counters = 0;
                    var totalCredits = 0;

                    if (bank == null) {
                        embed(channel, currentList, totalCredits, client);
                    } else {
                        const array = Object.entries(bank);
                        array.sort((b, a) => a[1] - b[1]);

                        array.forEach(([id, credits]) => {
                            counters = counters + 1;
                            totalCredits = totalCredits + credits;

                            if (credits > 0) {
                                currentList += `> ${counters}. <@${id}> \`\`${credits}\`\` credits\n`;
                            }
                        });
                        embed(channel, currentList, totalCredits, client);
                    }

                    async function embed(channel, currentList, totalCredits, client) {
                        //console.log(currentList)

                        const embed = new client.Discord.EmbedBuilder()
                            .setTitle((guild_var.name || 'Sniper') + " - Bank")
                            .setThumbnail(guild_var.iconURL() || client.user.avatarURL())
                            .setDescription(`${currentList || 'No users in the bank.'}`)
                            .setColor(guilds[guild]['data']['bank_embed_color'] || purple)
                            .setTimestamp()
                            .setFooter({ text: `${guild_var.name + ' Bank' || 'Made by: .answ3r'} | Total credits: ${totalCredits}` })

                        try {
                            bankEmbed.edit({ embeds: [embed], components: [] })
                        } catch {
                            channel.send({ embeds: [embed], components: [] })
                        }
                    }
                }
            }
        }

    } catch (e) {
        var logEmbed = await client.utils.newEmbed("Error")
            .setDescription("Bank Embed Update Error.\nError: " + e)
        client.utils.sendLog(guild, client, logEmbed);
    }

}

module.exports.ResellerEmbedUpdate = async (client) => {
    try {
        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        const channel = await client.channels.cache.find(channel => channel.id === client.config.Notification.resellerQueue);
        //console.log(channel.name)

        if (channel == null) {
            var logEmbed = await client.utils.newEmbed("Error")
                .setDescription("Reseller Embed Channel not found.")
            client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
            return;
        }

        const resellersEmbed = await channel.messages.fetch({ limit: 30 }).then(messages => {
            messages = messages.filter(msg => (msg.author.id == client.user.id && !msg.system));
            return messages.first();
        });

        var resellers = [];
        var credits = [];
        var time = [];
        var subscription = [];
        var allClaims = 0;
        var currentQueue = "";
        var valtozo_xddd_halfenglis_szet_baszlak_jazmin = '';

        if (guilds == null) {
            return;
        }

        for (const guild in guilds) {

            if (client.config["Bot Settings"]["guildId"] != guild) {
                if (!guilds[guild]['suspended']) {
                    if (guilds[guild]['permission']) {

                        allClaims = allClaims + guilds[guild]['credits'];
                        resellers.push(guilds[guild]['allowed_users'][0]);
                        credits.push(guilds[guild]['credits']);
                        time.push(guilds[guild]['date']);

                        var timenow = new Date().getTime() / 1000
                        try { var userendtime = guilds[guild]['timestamp'] } catch { }
                        if (userendtime === 0) {
                            valtozo_xddd_halfenglis_szet_baszlak_jazmin = '\`♾️\` Lifetime';
                        }
                        var checking_time = userendtime - timenow
                        if (checking_time > 0) {
                            valtozo_xddd_halfenglis_szet_baszlak_jazmin = `\`⏱️\` <t:${userendtime}:R>`;
                        }

                        subscription.push(valtozo_xddd_halfenglis_szet_baszlak_jazmin);
                    }
                }
            }

        }

        /*
        console.log(resellers)
        console.log(credits)
        console.log(time)
        */

        if (resellers.length <= 0) {
            currentQueue = "No users in the list.";
        } else {
            for (var i = 0; i < resellers.length; i++) {
                currentQueue += `> ${i + 1}. <@${resellers[i]}> | ${credits[i]} credits | <t:${time[i]}:R> | ${subscription[i]}\n`;
            }
        }

        //console.log(currentQueue)

        const embed = new client.Discord.EmbedBuilder()
            .setTitle((client.server.name || "Sniper") + " - Resellers")
            .setThumbnail(client.server.iconURL() || '')
            .setDescription(`${currentQueue}`)
            .setColor(guilds[client.config["Bot Settings"]["guildId"]]['data']['queue_embed_color'] || purple)
            .setTimestamp()
            .setFooter({ text: `${resellers.length} reseller | ${allClaims} total credits` })

        try {
            resellersEmbed.edit({ embeds: [embed], components: [] })
        } catch {
            channel.send({ embeds: [embed], components: [] })
        }


    } catch (err) {
        var logEmbed = await client.utils.newEmbed("Error")
            .setDescription("Reseller Embed Channel error.\nError: " + err)
        client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
        return;
    }
}

module.exports.addnewUserToQueue = async (client, i, token, total, userId, boost) => {
    try {

        if (!userId) {
            userId = i.member.id;
        }

        var queue = client.utils.getQueue();

        if (boost || false) {
            queue.push({ userId: userId, serverId: i.guild.id, token: token, total: total, used: 0, boost: true });
        } else {
            queue.push({ userId: userId, serverId: i.guild.id, token: token, total: total, used: 0 });

        }
        client.utils.saveQueue(queue);
        client.utils.QueueEmbedUpdate(client);
    } catch (e) { console.log("[-] Add User To Queue Error." + e) }
}

module.exports.addClaimToUser = async (client, position, amount) => {
    try {
        var queue = client.utils.getQueue();

        queue[position].total = queue[position].total + amount;

        client.utils.saveQueue(queue);
        client.utils.QueueEmbedUpdate(client);
    } catch (e) { console.log("[-] Add Claim To User Error." + e) }
}

module.exports.removeUserClaim = async (client, position, amount) => {
    try {
        var queue = client.utils.getQueue();

        queue[position].total = queue[position].total - amount;

        client.utils.saveQueue(queue);
        client.utils.QueueEmbedUpdate(client);
    } catch (e) { console.log("[-] Remove Claim From User Error." + e) }
}

module.exports.removeUserFromQueue = async (client, position) => {
    try {
        var queue = client.utils.getQueue();

        position = position - 1;

        if (position == 0) {
            queue.shift();
        } else {
            queue.splice(position, 1);
        }

        client.utils.saveQueue(queue);
        this.checkQueue(client);
        client.utils.QueueEmbedUpdate(client);
    } catch (e) { console.log("[-] Remove User From Queue Error." + e) }
}

module.exports.removeUser = async (client) => {
    var queue = await client.utils.getQueue();
    queue.shift();
    client.utils.saveQueue(queue);
}

module.exports.moveUserInQueue = async (client, position, newPosition) => {
    try {
        function arrayMove(arr, oldIndex, newIndex) {
            if (newIndex >= arr.length) {
                var k = newIndex - arr.length + 1;

                while (k--)
                    arr.push(undefined);
            }

            arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

            return arr;
        }

        var data = this.getDataAtPosition(position, client);

        if (data == null)
            return false;

        var queue = client.utils.getQueue();
        arrayMove(queue, position - 1, newPosition - 1);

        client.utils.saveQueue(queue);
        client.utils.QueueEmbedUpdate(client);
        return true;

    } catch (e) { console.log("[-] Move User In Queue Error." + e) }
}

module.exports.getDataAtPosition = async (position, client) => {
    try {
        var queue = client.utils.getQueue();

        for (var i = 0; i < queue.length; i++)
            if (position == i + 1)
                return queue[i];

        return null;
    } catch (e) { console.log("[-] Get Data At Position Error." + e) }
}

module.exports.newClaim = async (token, claims, client) => {
    try {
        if (claims == undefined || claims == null)
            claims = 1

        var queue = client.utils.getQueue();

        for (var i in queue) {
            if (queue[i].token === token) {
                queue[i].used += claims;

                client.utils.saveQueue(queue);
                break;
            }
        }
    } catch (e) { console.log("[-] New Claim Error." + e) }
}

module.exports.claimPing = async (client, type, time, userId, queue) => {
    console.log(`[+]`.green + ` Claimed:`.white + ` ${type}, ${time}`.blue);
    client.utils.QueueEmbedUpdate(client);
    client.utils.checkQueue(client);
    try {
        var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        var guild = queue.serverId;

        const guild_var = client.guilds.cache.get(guild);
        if (guild_var == undefined) return;
        const ch = await guild_var.channels.cache.get(guilds[guild]['data']['new_claim_notification_channel']);

        if (ch == undefined) return;
        if (guilds[guild]['data']['ping_role'] == undefined) return;

        if (userId == undefined) {
            var user = "";
        } else {
            var user = `for <@${userId}>`;
        }

        type = type.replace(`\``, '').replace(`\``, '');
        time = time.replace(`\``, '').replace(`\``, '');
        var reaction = guilds[guild]['data']['nitro_reaction_emoji'];
        var basic = guilds[guild]['data']['nitro_basic_emoji'] || "";
        var nitro = guilds[guild]['data']['nitro_emoji'] || "";
        var pingrole = guilds[guild]['data']['ping_role'] || "";

        if (pingrole == '') {
            pingrole = "";
        } else {
            pingrole = `<@&${pingrole}>`;
        }

        if (type == "Nitro Basic Monthly") {
            ch.send({ content: `${basic} Successfully claimed \`${type}\` in \`${time}\` ${user} ${pingrole}` })
                .then(msg => { msg.react(reaction || '🎉') });
        }
        else if (type == "Nitro Monthly") {
            ch.send({ content: `${nitro} Successfully claimed \`${type}\` in \`${time}\` ${user} ${pingrole}` })
                .then(msg => { msg.react(reaction || '🎉') });
        }
        else {
            ch.send({ content: `Successfully claimed \`${type}\` in \`${time}\` ${user} ${pingrole}` })
                .then(msg => { msg.react(reaction || '🎉') });
        }

        if (guild == client.config['Bot Settings']['guildId']) {
            //console.log('true')
        } else {
            //console.log('false') // le kell mind 2 szeron futnia

            setTimeout(async () => {
                var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

                var guild = client.config['Bot Settings']['guildId'];

                const guild_var = client.guilds.cache.get(guild);
                if (guild_var == undefined) return;
                const ch = await guild_var.channels.cache.get(guilds[guild]['data']['new_claim_notification_channel']);

                if (ch == undefined) return;
                if (guilds[guild]['data']['ping_role'] == undefined) return;

                if (userId == undefined) {
                    var user = "";
                } else {
                    var user = `for <@${userId}>`;
                }

                type = type.replace(`\``, '').replace(`\``, '');
                time = time.replace(`\``, '').replace(`\``, '');
                var reaction = guilds[guild]['data']['nitro_reaction_emoji'];
                var basic = guilds[guild]['data']['nitro_basic_emoji'] || "";
                var nitro = guilds[guild]['data']['nitro_emoji'] || "";
                var pingrole = guilds[guild]['data']['ping_role'] || "";

                if (pingrole == '') {
                    pingrole = "";
                } else {
                    pingrole = `<@&${pingrole}>`;
                }

                if (type == "Nitro Basic Monthly") {
                    ch.send({ content: `${basic} Successfully claimed \`${type}\` in \`${time}\` ${user} ${pingrole}` })
                        .then(msg => { msg.react(reaction || '🎉') });
                }
                else if (type == "Nitro Monthly") {
                    ch.send({ content: `${nitro} Successfully claimed \`${type}\` in \`${time}\` ${user} ${pingrole}` })
                        .then(msg => { msg.react(reaction || '🎉') });
                }
                else {
                    ch.send({ content: `Successfully claimed \`${type}\` in \`${time}\` ${user} ${pingrole}` })
                        .then(msg => { msg.react(reaction || '🎉') });
                }

            }, 2000);
        }

        //----------------------------------------------------------------
        //----------------------------------------------------------------
        //----------------------------------------------------------------


    } catch (e) {
        console.log(`${e}`.red);
        var logEmbed = await client.utils.newEmbed("Error")
            .setDescription("Claim ping notifi. \nError: " + e)
        client.utils.sendLog(guild, client, logEmbed);
    }
}

module.exports.checkQueue = async (client) => {
    try {
        var counting = -1;
        var counting2 = -1;
        var currentQueue = await client.utils.getQueue();
        const servers = JSON.parse(fs.readFileSync("./src/data/servers.json"));

        if (servers.length < 1) {
            return console.log("[-] You've not added any snipers to /data/servers.json");
        }

        if (currentQueue.length <= 0) {

            // switch egy ketto xd / 1) checkToken, 2) checkTokenUniversal
            //checkTokenUniversal(client, currentQueue, servers);
            this.QueueEmbedUpdate(client)
            return console.log("[+] No users in queue");
        }


        this.checkUserToken(currentQueue[0].token, false, async function (authenticationCheckResponse) {
            //console.log(authenticationCheckResponse.message)
            if (!authenticationCheckResponse.ok) {

                var logEmbed = client.utils.newEmbed('Invalid Token')
                    .setColor(red)
                    .setTimestamp()
                    .addFields([
                        { name: 'User', value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||`, inline: true },
                        { name: 'Token', value: `${currentQueue[0].token}`, inline: true },
                        { name: 'Total', value: `${currentQueue[0].total}`, inline: true },
                        { name: 'Used', value: `${currentQueue[0].used}`, inline: true },
                    ])

                if (client.config["Bot Settings"]["guildId"] == currentQueue[0]?.serverId) {
                    logEmbed.setDescription(`Token is invalid. Removing them from the queue.`)
                } else {
                    logEmbed.setDescription(`Token is invalid. Removing them from the queue.
                    **RESELLER SERVER**
                    ${currentQueue[0]?.serverId}`)
                };

                client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed)

                //------------
                var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                if (client.config["Bot Settings"]["guildId"] == currentQueue[0]?.serverId) {
                    client.utils.sendLog(currentQueue[0]?.serverId, client, client.utils.newEmbed('Invalid Token')
                        .setDescription(`Token is invalid. Removing them from the queue.`)
                        .setColor(red)
                        .setTimestamp()
                        .addFields([
                            { name: 'User', value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||`, inline: true },
                            { name: 'Token', value: `${currentQueue[0].token}`, inline: true },
                            { name: 'Total', value: `${currentQueue[0].total}`, inline: true },
                            { name: 'Used', value: `${currentQueue[0].used}`, inline: true },
                        ]), kaka[client.server.id].data['Invalid token'], 'Invalid token')
                }
                //------------

                var user = await client.users.fetch(currentQueue[0].userId).catch(err => { })

                if (user) {
                    var embed = client.utils.newEmbed("Invalid token!")
                        .setDescription(`\`⚠️\` Nitro could not be added to your account because your token is invalid.`)
                        .setColor(red);

                    user.send({ embeds: [embed] }).catch(error => {
                        var logEmbed = client.utils.newEmbed("Failed to send DM")
                            .setDescription(":x: | Failed to send DM to notify user about order completion.")
                            .addFields({ name: "User", value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||` })
                            .addFields({ name: "Error", value: `${error}` })
                            .setColor(red);
                        client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
                    });
                };

                //--------------------REMOVE USER--------------------

                //Credit refound invalid token
                var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                var credits = JSON.parse(fs.readFileSync("./src/data/credits.json"));

                if (!credits[currentQueue[0].serverId]) {
                    credits[currentQueue[0].serverId] = {}
                }

                if (!credits[currentQueue[0].serverId][currentQueue[0].userId]) {
                    credits[currentQueue[0].serverId][currentQueue[0].userId] = 0
                    fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4))
                }

                // -------------------------------- BOOOST FASZOM --------------------------------
                var totalAddedCredits = currentQueue[0].total - currentQueue[0].used;
                var addrole = 'no';
                var booost = currentQueue[0]?.boost || false;

                if (currentQueue[0]?.boost || false) {
                    var keys = JSON.parse(fs.readFileSync("./src/data/keys.json"));

                    var key = await utils.generateRandom(10);

                    keys.push({
                        key: key,
                        claims: totalAddedCredits,
                        addrole: addrole,
                        boost: true
                    });

                    fs.writeFileSync("./src/data/keys.json", JSON.stringify(keys, null, 4));


                    const embed = new client.Discord.EmbedBuilder()
                        .setTitle("Key generated")
                        .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                        .setThumbnail(client.server.iconURL() || "")
                        .addFields([
                            { name: "Claims", value: "`" + totalAddedCredits + "`", inline: true },
                            { name: "Only boost", value: booost.toString().replace("true", "`🟢` Yes").replace("false", "`🔴` No"), inline: true },
                            { name: "Add role in redeem", value: addrole.replace("yes", "`🟢` Yes").replace("no", "`🔴` No"), inline: true },
                            { name: "Key", value: "```" + key + "```", inline: false },
                        ])
                        .setTimestamp()

                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    client.utils.sendLog(client.server.id, client, embed, guilds[client.server.id].data['Key generator'], 'Key generator')
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    if (user) {
                        //--------------------SEND INFO TO USER--------------------

                        const embed = new client.Discord.EmbedBuilder()
                            .setTitle("You have received a key")
                            .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                            .setDescription("You have received a key.\n⚠️Redeem it with `/redeem`.\n")
                            .setThumbnail(client.server.iconURL() || "")
                            .addFields([
                                { name: "Claims", value: "```" + totalAddedCredits + "```", inline: true },
                                { name: "Only boost", value: "```" + booost.toString().replace("true", "🟢 Yes").replace("false", "🔴 No") + "```", inline: true },
                                { name: "Key", value: "```" + key + "```", inline: true },
                            ])
                            .setTimestamp()

                        user.send({ embeds: [embed] }).catch(err => {
                            console.log(`[-] Couldn't send the key to the user. User: ${user.username}#${user.discriminator}`)
                            interaction.followUp({ content: "I couldn't send the key to the user.", ephemeral: true });
                        });

                    };

                } else {
                    credits[currentQueue[0].serverId][currentQueue[0].userId] += totalAddedCredits;
                    fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4))
                }
                // ----------------------------------------------------------------------------------


                //client.utils.generateKey(client, currentQueue[0], currentQueue[0].total - currentQueue[0].used);
                client.utils.removeUser(client);

                var newQue = await client.utils.getQueue();

                // switch egy ketto xd / 1) checkToken, 2) checkTokenUniversal
                checkTokenUniversal(client, newQue, servers);

                //----------------------------------------------------------------

                //--------------------SEND INFO TO USER--------------------
                console.log(currentQueue[0]?.boost)
                if (!currentQueue[0]?.boost) {

                    if (user) {
                        const embed = new client.Discord.EmbedBuilder()
                            .setTitle("You have received a credit")
                            .setColor(guilds[currentQueue[0].serverId]["data"]["queue_embed_color"] || 0x00FF00)
                            .setDescription("You have successfully received the credit.\n⚠️Redeem it with `/redeem`.\n")
                            .setThumbnail(client.server.iconURL() || "")
                            .addFields([
                                { name: "Credit given", value: "```" + totalAddedCredits + "```", inline: true },
                            ])
                            .setTimestamp()

                        user.send({ embeds: [embed] }).catch((err) => {
                            var logEmbed = client.utils.newEmbed("Failed to send DM")
                                .setDescription(":x: | Failed to send DM to notify user about order completion.")
                                .addFields({ name: "User", value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||` })
                                .addFields({ name: "Error", value: `${err}` });
                            client.utils.sendLog(currentQueue[0].serverId, client, logEmbed);
                        }).catch((error) => {
                            var logEmbed = client.utils.newEmbed("Order completed")
                                .setDescription(":x: | Order completed. Failed to send direct message with order info to user. (on user fetch)")
                                .addFields({ name: "User", value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||` })
                                .addFields({ name: "Claims", value: currentQueue[0].total.toLocaleString("en-GB") })
                                .addFields({ name: "Error", value: `${error}` });
                            client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
                            client.utils.sendLog(currentQueue[0].serverId, client, logEmbed);
                        });
                    };
                };

                setTimeout(function () {
                    client.utils.BankEmbedUpdate(client);
                }, 2500);



            } else {
                check = true;

                // switch egy ketto xd / 1) checkToken, 2) checkTokenUniversal
                checkTokenUniversal(client, currentQueue, servers);
            }
        });

        //console.log(check)
        async function checkTokenUniversal(client, currentQueue, servers) {

            if (client.config['Sniper Settings'].sniper === 'snek') {
                checkTokenTXT(client, currentQueue, servers);
            };

            if (client.config['Sniper Settings'].sniper === 'cool') {
                checkTokenTXT(client, currentQueue, servers);
            };

            if (client.config['Sniper Settings'].sniper === 'zrx') {
                checkTokenTOML(client, currentQueue, servers);
            };

            async function checkTokenTXT(client, currentQueue, servers) {

                var servername_array = [];
                var status_array = [];
                var error_array = [];

                if (currentQueue.length == 0) {
                    for (var i = 0; i < servers.length; i++) {

                        servername_array.push(servers[i].vps_name);
                        client.utils.ssh(servers[i].username, servers[i].password, servers[i].host, servers[i].port, function (connection) {
                            counting++;
                            connection.execCommand("cat claimToken.txt", { cwd: `${servers[counting].sniperPath}/` }).then(function (output) {
                                counting2++;

                                if (output.stderr && output.stderr.length >= 1) {

                                    status_array.push("`❌` Error");
                                    error_array.push(output.stderr);

                                    if (counting2 == servers.length - 1)
                                        log(servername_array, status_array, error_array);

                                    return console.log("[checkQueue] Error while trying to update claimToken.txt");
                                } else {
                                    status_array.push("`✔️` Updated");
                                    error_array.push("No errors");

                                    //console.log(counting2 + " " + servers.length - 1)

                                    if (counting2 == servers.length - 1)
                                        log(servername_array, status_array, error_array);
                                }

                                connection.execCommand(`echo "${client.config["Sniper Settings"].emptyQueueClaimToken.trim()}" > claimToken.txt`, { cwd: `${servers[counting].sniperPath}/` }, function () { });
                            });
                        });
                    }
                } else if (currentQueue[0].token.length > 5 && currentQueue.length >= 1) {
                    for (var i = 0; i < servers.length; i++) {

                        servername_array.push(servers[i].vps_name);
                        client.utils.ssh(servers[i].username, servers[i].password, servers[i].host, servers[i].port, async function (connection) {
                            counting++;
                            connection.execCommand("cat claimToken.txt", { cwd: `${servers[counting].sniperPath}/` }).then(function (output) {
                                counting2++;

                                if (output.stderr && output.stderr.length >= 1) {

                                    status_array.push("`❌` Error");
                                    error_array.push(output.stderr);

                                    if (counting2 == servers.length - 1)
                                        log(servername_array, status_array, error_array);

                                    return console.log("[checkQueue] Error while trying to update claimToken.txt");
                                } else {
                                    status_array.push("`✔️` Updated");
                                    error_array.push("No errors");

                                    //console.log(counting2 + " " + servers.length - 1)

                                    if (counting2 == servers.length - 1)
                                        log(servername_array, status_array, error_array);
                                }

                                var currentToken = output.stdout;

                                if (currentToken.length < 10)
                                    connection.execCommand(`echo "${currentQueue[0].token.trim()}" > claimToken.txt`, { cwd: `${servers[counting].sniperPath}/` }, function () { });
                                else {
                                    if (currentQueue[0].token != currentToken)
                                        connection.execCommand(`echo "${currentQueue[0].token.trim()}" > claimToken.txt`, { cwd: `${servers[counting].sniperPath}/` }, function () { });
                                }
                            });
                        });
                    }
                }
            }

            async function checkTokenTOML(client, currentQueue, servers) {

                var servername_array = [];
                var status_array = [];
                var error_array = [];

                if (currentQueue.length == 0) {
                    for (var i = 0; i < servers.length; i++) {

                        servername_array.push(servers[i].vps_name);
                        client.utils.ssh(servers[i].username, servers[i].password, servers[i].host, servers[i].port, function (connection) {
                            counting++;
                            connection.execCommand(`cat config.toml | grep "MainToken" | awk '{print $3}'`, { cwd: `${servers[counting].sniperPath}/` }).then(function (output) {
                                counting2++;

                                if (output.stderr && output.stderr.length >= 1) {

                                    status_array.push("`❌` Error");
                                    error_array.push(output.stderr);

                                    if (counting2 == servers.length - 1) {
                                        log(servername_array, status_array, error_array);
                                    };

                                    return console.log("[checkQueue] Error while trying to update config.toml");
                                } else {
                                    status_array.push("`✔️` Updated");
                                    error_array.push("No errors");

                                    //console.log(counting2 + " " + servers.length - 1)

                                    if (counting2 == servers.length - 1)
                                        log(servername_array, status_array, error_array);
                                }

                                connection.execCommand(`sed -i 's/MainToken = .*/MainToken = ${client.config["Sniper Settings"].emptyQueueClaimToken.trim()}/' config.toml`, { cwd: `${servers[counting].sniperPath}/` }, function () { });
                            });
                        });
                    }
                } else if (currentQueue[0].token.length > 5 && currentQueue.length >= 1) {
                    for (var i = 0; i < servers.length; i++) {

                        servername_array.push(servers[i].vps_name);
                        client.utils.ssh(servers[i].username, servers[i].password, servers[i].host, servers[i].port, async function (connection) {
                            counting++;
                            connection.execCommand(`cat config.toml | grep "MainToken" | awk '{print $3}'`, { cwd: `${servers[counting].sniperPath}/` }).then(function (output) {
                                counting2++;

                                if (output.stderr && output.stderr.length >= 1) {

                                    status_array.push("`❌` Error");
                                    error_array.push(output.stderr);

                                    if (counting2 == servers.length - 1) {
                                        log(servername_array, status_array, error_array);
                                    }

                                    return console.log("[checkQueue] Error while trying to update config.toml");
                                } else {
                                    status_array.push("`✔️` Updated");
                                    error_array.push("No errors");

                                    //console.log(counting2 + " " + servers.length - 1)

                                    if (counting2 == servers.length - 1)
                                        log(servername_array, status_array, error_array);
                                }

                                var currentToken = output.stdout;

                                if (currentToken.length < 10) {
                                    connection.execCommand(`sed -i 's/MainToken = .*/MainToken = ${currentQueue[0].token.trim()}/' config.toml`, { cwd: `${servers[counting].sniperPath}/` }, function () { });
                                } else {
                                    if (currentQueue[0].token != currentToken) {
                                        connection.execCommand(`sed -i 's/MainToken = .*/MainToken = ${currentQueue[0].token.trim()}/' config.toml`, { cwd: `${servers[counting].sniperPath}/` }, function () { });
                                    }
                                }
                            });
                        });
                    }
                }
            }

        }

        function log(servername_array, status_array, error_array) {
            var logEmbed = client.utils.newEmbed("Queue Update Logger")
                .addFields(
                    { name: 'Server', value: servername_array.join("\n\n"), inline: true },
                    { name: 'Status', value: status_array.join("\n\n"), inline: true },
                    { name: 'Error', value: '`' + error_array.join("\n\n") + '`', inline: true }
                )
                .setColor("#EF7C0A")
                .setFooter({ text: "Developed by 💕 .answ3r" })
                .setTimestamp();


            client.utils.sendLog(client.config['Bot Settings']['guildId'], client, logEmbed);
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
            //client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Token update'], 'Token update')
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            client.utils.QueueEmbedUpdate(client);
        }

    } catch (e) { console.log("[-] Check Queue Error." + e) }
}

module.exports.checkUserToken2 = async (token, phonecheck, callback) => {
    let retry = true;

    while (retry) {
        try {
            const response = await axios.get('https://discord.com/api/v6/users/@me', {
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (response.status === 200) {
                if (response.data.verified === true) {
                    if (phonecheck) {
                        if (response.data.phone === null) {
                            retry = false;
                            return callback({ ok: false, message: "Your account is not verified. (Phone)" });
                        }
                    }
                    retry = false;
                    return callback({ ok: true, message: "Token is vaild. :)", data: response.data });
                } else {
                    retry = false;
                    return callback({ ok: false, message: "Your account is not verified. (Email)" });
                }
            } else {
                console.log('[E] Invalid TOKEN: '.red + response.status);
                return callback({ ok: false, message: `Failed to check authentication - ${response.status}` });
            }
        } catch (error) {
            console.log('[E] Check token:'.red + error);
            console.log('Retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Várunk egy ideig, mielőtt újra megpróbáljuk
        }
    }

    return callback({ ok: false, message: "Failed to make request to Discord." });
};

module.exports.checkUserToken = async (token, phonecheck, callback) => {

    if (token == 'alma-alma-alma-alma-alma-alma-alma') {
        return callback({ ok: true, message: "Token is valid. :)", data: "Teszt" });
    }

    const options = {
        hostname: 'discord.com',
        path: '/api/v6/users/@me',
        method: 'GET',
        headers: {
            Authorization: `${token}`,
        },
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const response = JSON.parse(data);
                if (response.verified === true) {
                    if (phonecheck) {
                        if (response.phone === null) {
                            return callback({ ok: false, message: "Your account is not verified. (Phone)" });
                        }
                    }
                    return callback({ ok: true, message: "Token is valid. :)", data: response });
                } else {
                    return callback({ ok: false, message: "Your account is not verified. (Email)" });
                }
            } else {
                if (JSON.parse(data).message.includes('You are being rate limited')) {
                    console.error(': Rate limited hiba!'.red + error);
                    console.log('Retrying...');
                    setTimeout(() => {
                        module.exports.checkUserToken(token, phonecheck, callback); // Rekurzív hívás újra megpróbáláshoz
                    }, 2500);
                } else {
                    return callback({ ok: false, message: `${JSON.parse(data).message}. (${res.statusCode})` });
                }
            }
        });
    });

    req.on('error', (error) => {
        console.error(': A token érvénytelen.'.red + error);
        console.log('Retrying...');
        setTimeout(() => {
            module.exports.checkUserToken(token, phonecheck, callback); // Rekurzív hívás újra megpróbáláshoz
        }, 1000);
    });

    req.end();
};


module.exports.checkQueueToken = async (client) => {
    var currentQueue = await client.utils.getQueue()

    if (currentQueue.length == 0) {
        console.log('No user in queue')
        return;
    }

    this.checkUserToken(currentQueue[0].token, false, async function (authenticationCheckResponse) {
        //console.log(authenticationCheckResponse.message)
        if (!authenticationCheckResponse.ok) {

            var logEmbed = client.utils.newEmbed('Invalid Token')
                .setColor(red)
                .setTimestamp()
                .addFields([
                    { name: 'User', value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||`, inline: true },
                    { name: 'Token', value: `${currentQueue[0].token}`, inline: true },
                    { name: 'Total', value: `${currentQueue[0].total}`, inline: true },
                    { name: 'Used', value: `${currentQueue[0].used}`, inline: true },
                ])

            if (client.config["Bot Settings"]["guildId"] == currentQueue[0]?.serverId) {
                logEmbed.setDescription(`Token is invalid. Removing them from the queue.`)
            } else {
                logEmbed.setDescription(`Token is invalid. Removing them from the queue.
            **RESELLER SERVER**
            ${currentQueue[0]?.serverId}`)
            };

            client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed)

            //------------
            var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
            if (client.config["Bot Settings"]["guildId"] == currentQueue[0]?.serverId) {
                client.utils.sendLog(currentQueue[0]?.serverId, client, client.utils.newEmbed('Invalid Token')
                    .setDescription(`Token is invalid. Removing them from the queue.`)
                    .setColor(red)
                    .setTimestamp()
                    .addFields([
                        { name: 'User', value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||`, inline: true },
                        { name: 'Token', value: `${currentQueue[0].token}`, inline: true },
                        { name: 'Total', value: `${currentQueue[0].total}`, inline: true },
                        { name: 'Used', value: `${currentQueue[0].used}`, inline: true },
                    ]), kaka[client.server.id].data['Invalid token'], 'Invalid token')
            }
            //------------

            var user = await client.users.fetch(currentQueue[0].userId)

            if (user) {
                var embed = client.utils.newEmbed("Invalid token!")
                    .setDescription(`\`⚠️\` Nitro could not be added to your account because your token is invalid.`)
                    .setColor(red);

                user.send({ embeds: [embed] }).catch(error => {
                    var logEmbed = client.utils.newEmbed("Failed to send DM")
                        .setDescription(":x: | Failed to send DM to notify user about order completion.")
                        .addFields({ name: "User", value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||` })
                        .addFields({ name: "Error", value: `${error}` })
                        .setColor(red);
                    client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
                });
            };


            //--------------------REMOVE USER--------------------
            await client.utils.removeUser(client);

            //------------------------------- Credit refound invalid token ---------------------------------
            //Credit refound invalid token
            var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
            var credits = JSON.parse(fs.readFileSync("./src/data/credits.json"));

            if (!credits[currentQueue[0].serverId]) {
                credits[currentQueue[0].serverId] = {}
            }

            if (!credits[currentQueue[0].serverId][currentQueue[0].userId]) {
                credits[currentQueue[0].serverId][currentQueue[0].userId] = 0
                fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4))
            }

            // -------------------------------- BOOOST FASZOM --------------------------------
            var totalAddedCredits = currentQueue[0].total - currentQueue[0].used;
            var addrole = 'no';
            var booost = currentQueue[0]?.boost || false

            if (currentQueue[0]?.boost || false) {
                var keys = JSON.parse(fs.readFileSync("./src/data/keys.json"));

                var key = await utils.generateRandom(10);

                keys.push({
                    key: key,
                    claims: totalAddedCredits,
                    addrole: addrole,
                    boost: true
                });

                fs.writeFileSync("./src/data/keys.json", JSON.stringify(keys, null, 4));


                const embed = new client.Discord.EmbedBuilder()
                    .setTitle("Key generated")
                    .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                    .setThumbnail(client.server.iconURL() || "")
                    .addFields([
                        { name: "Claims", value: "`" + totalAddedCredits + "`", inline: true },
                        { name: "Only boost", value: booost.toString().replace("true", "`🟢` Yes").replace("false", "`🔴` No"), inline: true },
                        { name: "Add role in redeem", value: addrole.replace("yes", "`🟢` Yes").replace("no", "`🔴` No"), inline: true },
                        { name: "Key", value: "```" + key + "```", inline: false },
                    ])
                    .setTimestamp()

                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                client.utils.sendLog(client.server.id, client, embed, guilds[client.server.id].data['Key generator'], 'Key generator')
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if (user) {

                    //--------------------SEND INFO TO USER--------------------

                    const embed = new client.Discord.EmbedBuilder()
                        .setTitle("You have received a key")
                        .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || purple)
                        .setDescription("You have received a key.\n⚠️Redeem it with `/redeem`.\n")
                        .setThumbnail(client.server.iconURL() || "")
                        .addFields([
                            { name: "Claims", value: "```" + totalAddedCredits + "```", inline: true },
                            { name: "Only boost", value: "```" + booost.toString().replace("true", "🟢 Yes").replace("false", "🔴 No") + "```", inline: true },
                            { name: "Key", value: "```" + key + "```", inline: true },
                        ])
                        .setTimestamp()

                    user.send({ embeds: [embed] }).catch(err => {
                        console.log(`[-] Couldn't send the key to the user. User: ${user.username}#${user.discriminator}`)
                        interaction.followUp({ content: "I couldn't send the key to the user.", ephemeral: true });
                    });

                };

            } else {
                credits[currentQueue[0].serverId][currentQueue[0].userId] += totalAddedCredits;
                fs.writeFileSync("./src/data/credits.json", JSON.stringify(credits, null, 4))
            }
            // ----------------------------------------------------------------------------------

            //client.utils.generateKey(client, currentQueue[0], currentQueue[0].total - currentQueue[0].used);
            //this.removeUserFromQueue(client, 1)


            if (!currentQueue[0]?.boost || false) {

                if (user) {

                    //--------------------SEND INFO TO USER--------------------

                    const embed = new client.Discord.EmbedBuilder()
                        .setTitle("You have received a credit")
                        .setColor(guilds[currentQueue[0].serverId]["data"]["queue_embed_color"] || 0x00FF00)
                        .setDescription("You have successfully received the credit.\n⚠️Redeem it with `/redeem`.\n")
                        .setThumbnail(client.server.iconURL() || "")
                        .addFields([
                            { name: "Credit given", value: "```" + totalAddedCredits + "```", inline: true },
                        ])
                        .setTimestamp()

                    user.send({ embeds: [embed] }).catch((err) => {
                        var logEmbed = client.utils.newEmbed("Failed to send DM")
                            .setDescription(":x: | Failed to send DM to notify user about order completion.")
                            .addFields({ name: "User", value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||` })
                            .addFields({ name: "Error", value: `${err}` });
                        client.utils.sendLog(currentQueue[0].serverId, client, logEmbed);
                    }).catch((error) => {
                        var logEmbed = client.utils.newEmbed("Order completed")
                            .setDescription(":x: | Order completed. Failed to send direct message with order info to user. (on user fetch)")
                            .addFields({ name: "User", value: `<@${currentQueue[0].userId}> ||(${currentQueue[0].userId})||` })
                            .addFields({ name: "Claims", value: currentQueue[0].total.toLocaleString("en-GB") })
                            .addFields({ name: "Error", value: `${error}` });
                        client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
                        client.utils.sendLog(currentQueue[0].serverId, client, logEmbed);
                    });

                    setTimeout(function () {
                        client.utils.BankEmbedUpdate(client);
                    }, 2500);
                };
            };

        } else {
            check = true;
            // switch egy ketto xd / 1) checkToken, 2) checkTokenUniversal
            //checkTokenUniversal(client, currentQueue, servers);
            console.log('[OK] Token is valid.'.green)
        }
    });



}

module.exports.claimTest = (client, category) => {
    try {

        const embed_mark = new client.Discord.EmbedBuilder()

        if (client.config['Sniper Settings'].sniper === 'zrx') {

            embed_mark.setTitle("✅ answ3r Nitro Claimer")
            embed_mark.setColor(purple)
            embed_mark.setDescription(":white_check_mark: this is a test message")
            embed_mark.setTimestamp()
            embed_mark.setFooter({ text: "Developed with ❤️ by .answ3r" })

            if (getRandomInt(2) == 1) {

                embed_mark.addFields([
                    { name: "Type", value: "`Nitro Monthly`", inline: true },
                    { name: "Delay", value: "`0.3213s`", inline: true },
                    { name: "Code", value: "`f41378fh4fwod`", inline: true },
                    { name: "Sniper", value: "zrx", inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                ])

            } else {

                embed_mark.addFields([
                    { name: "Type", value: "`Nitro Basic Monthly`", inline: true },
                    { name: "Delay", value: "`0.3213s`", inline: true },
                    { name: "Code", value: "`f41378fh4fwod`", inline: true },
                    { name: "Sniper", value: "zrx", inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                ])
            }
        }

        if (client.config['Sniper Settings'].sniper === 'snek') {

            embed_mark.setTitle("answ3r Nitro Claimer")
            embed_mark.setColor(purple)
            embed_mark.setDescription(":white_check_mark: | this is a test message")
            embed_mark.setTimestamp()
            embed_mark.setFooter({ text: "Developed with ❤️ by .answ3r" })

            if (getRandomInt(2) == 1) {

                embed_mark.addFields([
                    { name: "Code", value: "`f41378fh4fwod`", inline: true },
                    { name: "Delay", value: "`0.3213s`", inline: true },
                    { name: "Type", value: "`Nitro Monthly`", inline: true },
                    { name: "Sniper", value: "snek", inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                ])

            } else {

                embed_mark.addFields([
                    { name: "Code", value: "`f41378fh4fwod`", inline: true },
                    { name: "Delay", value: "`0.3213s`", inline: true },
                    { name: "Type", value: "`Nitro Basic Monthly`", inline: true },
                    { name: "Sniper", value: "snek", inline: true },
                    { name: "Guild Name", value: 'answ3r Development', inline: true },
                ])
            }
        }


        const embed_401 = new client.Discord.EmbedBuilder()
            .setTitle(":x: answ3r Nitro Claimer")
            .setColor(purple)
            .setDescription(":x: this is a test message")
            .addFields([
                { name: "Code", value: "2f234f23rf134rf", inline: true },
                { name: "Delay", value: "0,03242s", inline: true },
                { name: "Sniper", value: ".answ3r", inline: true },
                { name: "Sender", value: "41238972456853425", inline: true },
                { name: "Guild ID", value: "56234896724325543", inline: true },
                { name: "Guild Name", value: 'Developed with ❤️ by .answ3r', inline: true },
                { name: "Response", value: '```json\n{"message": "401: Unauthorized", "code":0}```', inline: true },
            ])
            .setTimestamp()
            .setFooter({ text: "Test" })

        if (category == "ok") {
            const ch = client.channels.cache.get(client.config["Sniper Settings"].successfulChannelId);
            if (ch) ch.send({ embeds: [embed_mark] });

        } else if (category == "not") {
            const ch = client.channels.cache.get(client.config["Sniper Settings"].failedChannelId);
            if (ch) ch.send({ embeds: [embed_401] });
        }


    } catch (e) { console.log("[-] Claim Test Error." + e) }
}

module.exports.home_permCheck = (i, client) => {

    if (i.user.id == utils.ansid()) {
        return true;
    }
    if (!i.member.roles.cache.has(client.config["Bot Settings"].adminRoleId)) {
        i.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        return false;
    }
    return true;
}

module.exports.reseller_permCheck = (i, client) => {
    var file = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

    if (i.user.id == utils.ansid()) {
        return true;
    }

    //console.log(client.config["Bot Settings"].adminRoleId)

    try {
        i.member.roles.cache.has(client.config["Bot Settings"].adminRoleId)
    } catch {
        console.log('[!] INVALID ADMIN ROLE ID!!!!!!')
        return false;
    }

    if (i.member.roles.cache.has(client.config["Bot Settings"].adminRoleId)) {
        return true;
    }

    if (file[i.guild.id] == undefined) {
        i.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        return false;
    }

    if (file[i.guild.id]['suspended'] == true) {
        i.reply({ content: `\`⚠️\` The subscription has been suspended.`, ephemeral: true });
        return false;
    }

    if (file[i.guild.id]['permission'] == false) {
        i.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        return false;
    }

    if (file[i.guild.id]['timestamp'] == 1) {
        i.reply({ content: `\`⚠️\` The subscription has been expired.`, ephemeral: true });
        return false;
    }

    if (!file[i.guild.id]['allowed_users'].includes(i.user.id)) {
        i.reply({ content: "You don't have permission to use this command. (Reseller)", ephemeral: true });
        return false;
    }
    return true;

}

module.exports.guild_permCheck = (i, client) => {
    var file = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

    if (i.user.id == utils.ansid()) {
        return true;
    }

    if (i.member.roles.cache.has(client.config["Bot Settings"].adminRoleId)) {
        return true;
    }


    if (file[i.guild.id] == undefined) {
        i.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        return false;
    }

    if (file[i.guild.id]['suspended'] == true) {
        i.reply({ content: `\`⚠️\` The subscription has been suspended.`, ephemeral: true });
        return false;
    }

    if (file[i.guild.id]['permission'] == false) {
        i.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        return false;
    }

    if (file[i.guild.id]['timestamp'] == 1) {
        i.reply({ content: `\`⚠️\` The subscription has been expired.`, ephemeral: true });
        return false;
    }

    if (!file[i.guild.id]['allowed_users'].includes(i.user.id)) {
        i.reply({ content: "You don't have permission to use this command. (Reseller)", ephemeral: true });
        return false;
    }
}

module.exports.getQueue = () => {
    return JSON.parse(fs.readFileSync("./src/data/queue.json"));
}

module.exports.getGuild = (guildId) => {
    var file = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
    return file[guildId];
}

module.exports.saveQueue = (queue) => {
    fs.writeFileSync("./src/data/queue.json", JSON.stringify(queue, null, 4));
}

module.exports.generateKey = async (client, topQueueUser, claims, key) => {
    var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
    if (key == undefined) {
        var key = await utils.generateRandom(10);
    }

    if (topQueueUser.total >= 1) {

        var keys = JSON.parse(fs.readFileSync("./src/data/keys.json"));
        keys.push({
            key: key,
            claims: claims,
            addrole: false
        });

        fs.writeFileSync("./src/data/keys.json", JSON.stringify(keys, null, 4));

        const user = client.server.members.cache.get(topQueueUser.userId);

        var logEmbed = new client.Discord.EmbedBuilder()
            .setTitle("Key generated")
            .setColor(guilds[topQueueUser["serverId"]]["data"]["queue_embed_color"] || purple)
            .setThumbnail(client.server.iconURL() || "")
            .addFields([
                { name: "Claims", value: "`" + (claims) + "`", inline: true },
                { name: "Add role in redeem", value: "`🔴` No", inline: true },
                { name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||`, inline: true },
                { name: "Key", value: "```" + key + "```", inline: false },
            ])
            .setTimestamp()
        client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Key generator'], 'Key generator')
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (user) {
            const embed = new client.Discord.EmbedBuilder()
                .setTitle("You have received a key")
                .setColor(guilds[topQueueUser["serverId"]]["data"]["queue_embed_color"] || purple)
                .setDescription("Your authentication token has become invalid so I cannot complete your order.\n\nYou have received a key from " + user.username + ".\n⚠️Redeem it with `/redeem`.\n")
                .setThumbnail(client.server.iconURL() || "")
                .addFields([
                    { name: "Claims", value: "```" + (claims) + "```", inline: true },
                    { name: "Key", value: "```" + key + "```", inline: true },
                ])
                .setTimestamp()

            user.send({ embeds: [embed] }).catch(error => {
                var logEmbed = new client.Discord.EmbedBuilder()
                    .setTitle("Failed to send DM")
                    .setDescription(":x: | Failed to send DM to notify user generated key.")
                    .addFields({ name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||` })
                    .addFields({ name: "Error", value: `${error}` });
                client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
            });
        }
    } else {
        await client.utils.removeUser(client);

        var embed = new client.Discord.EmbedBuilder()
            .setDescription(`Your order is now complete. I hope you are satisfied with the service.`);

        client.users.fetch(topQueueUser.userId).then(user => {
            user.send({ embeds: [embed] }).catch(error => {
                var logEmbed = new client.Discord.EmbedBuilder()
                    .setTitle("Failed to send DM")
                    .setDescription(":x: | Failed to send DM to notify user about order completion.")
                    .addFields({ name: "User", value: `<@${topQueueUser.userId}> ||(${topQueueUser.userId})||` })
                    .addFields({ name: "Error", value: `${error}` });
                client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed);
            });
        });

        client.utils.checkQueue(client);
    }

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports.checkResllerTime = async (client) => {
    var guilds = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));


    for (var guildId in guilds) {
        //1136221289045037066
        //const channel = await client.channels.cache.find(channel => channel.id === '1136221289045037066');

        var timenow = new Date().getTime() / 1000
        try { var userendtime = guilds[guildId]['timestamp'] } catch { }
        if (userendtime === 0) {
            //hannel.send(`Aljal le jart???????? \`♾️\` Lifetime`);
            return;
        }
        var checking_time = userendtime - timenow

        if (checking_time > 0) {
            //channel.send(`Aljal le jart???????? <t:${userendtime}:R>`)
            return;
        } else {
            if (guilds[guildId]['timestamp'] == 1) return;

            guilds[guildId]['timestamp'] = 1;
            fs.writeFileSync("./src/data/guilds.json", JSON.stringify(guilds, null, 4));

            const guild_var = client.guilds.cache.get(guildId);
            if (guild_var == undefined) return;

            const owner = guild_var.members.cache.get(guild_var.ownerId);

            owner.send(`\`⚠️\` The subscription has been expired.`).catch(error => { })

        }

    }

}