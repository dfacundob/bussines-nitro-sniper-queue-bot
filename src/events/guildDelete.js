const fs = require("fs");
const utils = require('spacejs-utils');
const moment = require('moment');

module.exports = {
    name: 'guildDelete',
    async execute(guild, client) {
        let createdAt = moment(guild.createdAt);
        let dateFormated = createdAt.format('YYYY/MM/DD') + '( ' + createdAt.fromNow() + ' )';
        //console.log(guild);

        //log 
        var logEmbed = await client.utils.newEmbed("Bot leave guild!")
            .addFields({ name: "Name", value: guild.name, inline: true })
            .addFields({ name: "Owner", value: `<@${guild.ownerId}>`, inline: true })
            //.addFields({ name: "Members", value: guild.members.size, inline: true })
            .addFields({ name: "Guild Create At", value: `${dateFormated}`, inline: true })

            .setThumbnail(guild.iconURL({ dynamic: true, size: 2048 }))
        client.utils.sendLog(client.config["Bot Settings"]["guildId"], client, logEmbed)
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var kaka = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
                client.utils.sendLog(client.server.id, client, logEmbed, kaka[client.server.id].data['Bot leave'], 'Bot leave')
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }
};