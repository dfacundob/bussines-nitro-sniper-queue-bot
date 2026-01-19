const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add a user to the queue.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add to the queue.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('token')
                .setDescription('The token to use for claiming.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of codes to claim.')
                .setRequired(true)),

    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser('user');
        const token = interaction.options.getString('token');
        const amount = interaction.options.getInteger('amount');

        var guilds = await JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));

        if (1 > amount) {
            return interaction.editReply({ content: '`✖️` Not a valid amount!', ephemeral: true });
        }

        if (!token == 'alma') {
            if (token.length < 20)
                return interaction.editReply({ content: "Invalid token, please input a valid token.", ephemeral: true });
        }

        client.utils.checkUserToken(token, true, function (authenticationCheckResponse) {
            if (!authenticationCheckResponse.ok) {
                return interaction.editReply({ content: authenticationCheckResponse.message, ephemeral: true });
            }

            

            client.utils.addnewUserToQueue(client, interaction, token, amount, user.id);

            let member = interaction.guild.members.cache.get(user.id); // Get the member from the server !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            member.roles.add(guilds[interaction.guild.id]['data']['customer_role']).catch((err) => {
                console.log("[-] Error while adding role to user: " + err);
            });

            interaction.editReply({ content: `Added ${user.username} to the queue.`, ephemeral: true });
        });
    },
};