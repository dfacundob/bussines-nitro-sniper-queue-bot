const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const fs = require('fs')

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('token-change')
        .setDescription('Check if a token is valid.')
        .addStringOption(option =>
            option.setName('token')
                .setDescription('The token to check.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (client.utils.reseller_permCheck(interaction, client) == false) return;
        if (client.utils.guild_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });
        const token = interaction.options.getString('token');
        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        client.utils.checkUserToken(token, true, function (authenticationCheckResponse) {
            //console.log(authenticationCheckResponse)
            if (!authenticationCheckResponse.ok) {
                return interaction.editReply({ content: "`🔴` " + authenticationCheckResponse.message, ephemeral: true });
            } else {
                //console.log(authenticationCheckResponse.data)
                var user = authenticationCheckResponse.data
                return interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(guilds[client.config["Bot Settings"]["guildId"]]["data"]["queue_embed_color"] || '#3d3dc4')
                        .setTitle(authenticationCheckResponse.message)
                        .setDescription(`------------------------
                        **Username:** <@${user?.id}> ||${user?.id}||
                        **Global name:** ${user?.global_name}`)

                    ], ephemeral: true
                });
            }
        });
    },
};