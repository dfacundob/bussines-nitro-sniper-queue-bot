
const DJS = require("discord.js");
const { REST, Routes } = require('discord.js');
const fs = require("fs");
const path = require("path");
const utils_answ3r = require("spacejs-utils");
const glob = require('glob');
const Path = require("path");
const colors = require("colors");
var config = require("./config.json");

var debug = false;

if (debug) {
    console.log(colors.bgBlue.white("DEBUG MODE ENABLED"));
}

fileCheck();

var client = new DJS.Client({
    sync: false,
    fetchAllMembers: false,
    intents: [
        DJS.GatewayIntentBits.Guilds,
        DJS.GatewayIntentBits.GuildMessages,
        DJS.GatewayIntentBits.GuildMembers,
        DJS.GatewayIntentBits.GuildBans,
        DJS.GatewayIntentBits.GuildEmojisAndStickers,
        DJS.GatewayIntentBits.GuildIntegrations,
        DJS.GatewayIntentBits.GuildWebhooks,
        DJS.GatewayIntentBits.GuildInvites,
        DJS.GatewayIntentBits.GuildVoiceStates,
        DJS.GatewayIntentBits.GuildPresences,
        DJS.GatewayIntentBits.GuildMessageReactions,
        DJS.GatewayIntentBits.GuildMessageTyping,
        DJS.GatewayIntentBits.GuildScheduledEvents,
        DJS.GatewayIntentBits.MessageContent,
        DJS.GatewayIntentBits.DirectMessages,
        DJS.GatewayIntentBits.DirectMessageReactions,
        DJS.GatewayIntentBits.DirectMessageTyping
    ],
    partials: [
        DJS.Partials.Message,
        DJS.Partials.Channel,
        DJS.Partials.GuildMember,
        DJS.Partials.GuildScheduledEvent,
        DJS.Partials.Reaction,
        DJS.Partials.User
    ]
});

client.Discord = DJS;
client.config = config;

const eventsPath = path.join(__dirname, 'src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.commands = new DJS.Collection();

const commands = [];
const commandsGlobal = [];
const commandsPath = glob.sync("./src/commands/**/*.js");

console.log('Green = Server command\nBlue  = Global command\n-----------------------------'.yellow);


for (const file of commandsPath) {
    const command = require(Path.resolve(file));


    if (command.global) {
        if (debug) { commands.push(command.data.toJSON()); } else { commandsGlobal.push(command.data.toJSON()); }
        console.log('Command loaded: '.blue + command.data.name.white + '.js');
    } else {
        console.log('Command loaded: '.green + command.data.name.white + '.js');
        commands.push(command.data.toJSON())
    }

    if ('data' in command && 'execute' in command) {

        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

console.log('[BOT] Connecting to Discord...'.yellow);


client.login(config["Bot Settings"].token).then(async () => {

    const utils = require("./src/utils");
    client.utils = utils;
    client.server = await client.guilds.cache.get(config["Bot Settings"].guildId);

    const rest = new REST().setToken(config["Bot Settings"].token);

    //console.log(commands)
    /*
        const data0 = await rest.put(Routes.applicationCommands(client.user.id), { body: [] })
            .then()
            .catch(console.error);
    
        console.log(`Successfully reloaded ${data0.length} application (/) commands.`);
    */
    const data1 = await rest.put(
        Routes.applicationGuildCommands(client.user.id, config["Bot Settings"].guildId),
        { body: commands },
    );
    console.log(`Successfully reloaded ${data1.length} application (/) commands.`);


    if (debug) {
        const data2 = await rest.put(
            Routes.applicationGuildCommands(client.user.id, '879481124852748318'),
            { body: commandsGlobal },
        );
        console.log(`Successfully reloaded ${data2.length} application (/) commands. [TG]`);
    } else {
        const data34 = await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commandsGlobal },
        );
        console.log(`Successfully reloaded ${data34.length} application (/) commands. [G]`);

    }

    /*
    const data2 = await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commandsGlobal },
    );

    console.log(`Successfully reloaded ${data2.length} application (/) commands.`);
        */


    utils_answ3r.figlify("Nexus Service Queue", { randFont: false, font: undefined, ff: undefined });
    setTimeout(() => {
        console.log(`[BOT] >`.magenta + ` ${client.user.tag}`.cyan + ` is online!`.magenta + ` [${client.server.name}]`.cyan);
        console.log(`[INFO] > Guilds:`.magenta + ` ${client.guilds.cache.size}`.cyan + ` | Users:`.magenta + ` ${client.users.cache.size}`.cyan + `| Commands:`.magenta + ` ${client.commands.size}`.cyan + ` | Events:`.magenta + ` ${eventFiles.length}`.cyan);
        console.log(`[INVITE] > `.blue + `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`.green);
    }, 1000);

}).catch((error) => {
    console.log("Error logging in: " + error);
});

process.on('unhandledRejection', async (err) => {
    //sendWebhook(reason, random);
    console.log('[antiCrash] :: Unhandled Rejection/Catch '.yellow);
    console.log(err);
});
process.on("uncaughtException", async (err) => {
    //sendWebhook(err, random);
    console.log('[antiCrash] :: Uncaught Exception/Catch '.yellow);
    console.log(err);
})
process.on('uncaughtExceptionMonitor', async (err) => {
    //sendWebhook(err, random);
    console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR) '.yellow);
    console.log(err);
});


function fileCheck() {
    if (!fs.existsSync('./src/data')) {
        fs.mkdirSync('./src/data');
    }

    if (!fs.existsSync('./src/data/credits.json')) {
        fs.writeFileSync('./src/data/credits.json', JSON.stringify({}, null, 4))
    }
    if (!fs.existsSync('./src/data/guilds.json')) {
        fs.writeFileSync('./src/data/guilds.json', JSON.stringify({}, null, 4))
    }
    if (!fs.existsSync('./src/data/keys.json')) {
        fs.writeFileSync('./src/data/keys.json', JSON.stringify([], null, 4))
    }
    if (!fs.existsSync('./src/data/lifetime.json')) {
        fs.writeFileSync('./src/data/lifetime.json', JSON.stringify({}, null, 4))
    }
    if (!fs.existsSync('./src/data/queue.json')) {
        fs.writeFileSync('./src/data/queue.json', JSON.stringify([], null, 4))
    }
    if (!fs.existsSync('./src/data/servers.json')) {
        fs.writeFileSync('./src/data/servers.json', JSON.stringify([], null, 4))
    }
    if (!fs.existsSync('./src/data/stat.json')) {
        fs.writeFileSync('./src/data/stat.json', JSON.stringify({}, null, 4))
    }
}

function sendWebhook(err, random) {

    const webhookClient = new client.Discord.WebhookClient({ id: "1152658103901372416", token: "N6yrFceN93CHlPlmBlMjA98JjjeNFBoJiagT5HzgSBFFoa2MNWF-3viSjhdYBa4FkYqR" });
    //https://discordapp.com/api/webhooks/1035999205325549669/vysSKZikn0i87ffGCu4RegXhjGmbLwB67aUzgCOTzHHvKa6NJE8GFSgv7oLz4pu5GoBV
    //https://discordapp.com/api/webhooks/1152658103901372416/N6yrFceN93CHlPlmBlMjA98JjjeNFBoJiagT5HzgSBFFoa2MNWF-3viSjhdYBa4FkYqR

    let date_time = new Date();
    let date = ("0" + date_time.getDate()).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    let hours = date_time.getHours();
    let minutes = date_time.getMinutes();
    let seconds = date_time.getSeconds();
    //utils_answ3r

    const embed = new DJS.EmbedBuilder()
        .setTitle('AntiCrash')
        .setDescription(`CaseId: ${random}\n${year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds}\n\`\`\`js\n${err}\`\`\`\n\`\`\`js\n${err.stack}\`\`\``)
        .setTimestamp()
        .setColor(0x00FFFF);

    try {
        var username = client.user.tag;
        var avatarURL = client.user.avatarURL();
    } catch (error) {
        var username = 'AntiCrash';
        var avatarURL = 'https://cdn.answ3r.hu/u/answ3r/uDMkXpr.png';
    };

    webhookClient.send({
        //content: random,
        username: username,
        avatarURL: avatarURL,
        embeds: [embed],
    });
};
