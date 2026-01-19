const fs = require("fs");
const utils = require('spacejs-utils');
const moment = require('moment');

module.exports = {
    name: 'guildCreate',
    async execute(guild, client) {
        const data = JSON.parse(fs.readFileSync("./src/data/guilds.json", "utf8"));


        let createdAt = moment(guild.createdAt);
        let dateFormated = createdAt.format('YYYY/MM/DD') + '( ' + createdAt.fromNow() + ' )';
        //console.log(guild);

        //log 
        var logEmbed = await client.utils.newEmbed("Bot join guild!")
            .addFields({ name: "Name", value: guild.name, inline: true })
            .addFields({ name: "Owner", value: `<@${guild.ownerId}>`, inline: true })
            //.addFields({ name: "Members", value: guild.members.size, inline: true })
            .addFields({ name: "Guild Create At", value: `${dateFormated}`, inline: true })

            .setThumbnail(guild.iconURL({ dynamic: true, size: 2048 }))
        client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed)
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Bot join'], 'Bot join')
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (data[guild.id] === undefined) {
            //find owner
            let owner = await guild.members.cache.get(guild.ownerId);
            owner.send(`\`💥\` There is no permission to use the bot on your server!\n\nBecome a reseller: ${client.config["Bot Settings"]["discordInvite"]}`).catch(e => { });

            guild.leave()
            return;
        } else if (data[guild.id]['permission'] === false) {
            //find owner
            let owner = await guild.members.cache.get(guild.ownerId);
            owner.send(`\`💥\` There is no permission to use the bot on your server!\n\nBecome a reseller: ${client.config["Bot Settings"]["discordInvite"]}`).catch(e => { });

            guild.leave()
            return;
        }
    }
};