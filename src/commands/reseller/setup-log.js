const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const isValidHex = hex => /^#(([0-9A-Fa-f]{2}){3,4}|[0-9A-Fa-f]{3})$/.test(hex);

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName('setup-log')
        .setDescription('Sets up the bot logs.')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category to set up.')
                .setRequired(true)
                .addChoices(
                    { name: 'Developed by 💕 .answ3r', value: 'developed_by_answ3r2' },
                    { name: '---------( Logs Settings )--------', value: 'elvalaszto2' },
                    { name: 'Log Channel (All)', value: 'log_channel2' },
                    { name: 'Invalid token', value: 'Invalid token' }, //ko
                    { name: 'Add credits', value: 'Add credits' }, //ko
                    { name: 'Remove credits', value: 'Remove credits' }, //ko
                    { name: 'Gift credits', value: 'Gift credits' }, //ok
                    { name: 'Key generator', value: 'Key generator' }, //ok
                    { name: 'Token update', value: 'Token update' }, //OK            Ide kerülnek az update claimtoken.txt
                    { name: 'Order completted', value: 'Order completted' }, //OK
                    { name: 'Redeem', value: 'Redeem' }, //OK
                    { name: 'Add permission', value: 'Add permission' }, //ok
                    { name: 'Remove permission ', value: 'Remove permission' }, //ok
                    { name: 'Add balance', value: 'Add balance' }, //ok
                    { name: 'Remove balance', value: 'Remove balance' }, //ok
                    { name: 'Supsesion', value: 'Supsesion' }, //ok
                    { name: 'Unsupsesion', value: 'Unsupsesion' }, //ok
                    { name: 'Order canceled', value: 'Order canceled' }, //
                    { name: 'Bot join', value: 'Bot join' }, //
                    { name: 'Bot leave', value: 'Bot leave' }, //
                ))
        .addStringOption(option =>
            option.setName('value')
                .setDescription('The value to set.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits[8]),
    async execute(interaction, client) {
        if (client.utils.reseller_permCheck(interaction, client) == false) return;
        if (client.utils.guild_permCheck(interaction, client) == false) return;



        await interaction.deferReply({ ephemeral: true });

        var file = JSON.parse(fs.readFileSync('./src/data/guilds.json', 'utf8'));
        var config = file[interaction.guild.id]['data'];
        var category = interaction.options.getString('category');

        switch (category) {
            case 'developed_by_answ3r2':
                interaction.editReply({ content: "Developed by 💕 .answ3r https://store.answ3r.hu/", ephemeral: true });
                break;
            case 'elvalaszto2':
                interaction.editReply({ content: "You stupid idiot, you can't set this value!", ephemeral: true });
                break;
            case 'log_channel2':
                config.log_channel = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Invalid token':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Add credits':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Remove credits':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Gift credits':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Key generator':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Token update':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Order completted':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Redeem':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Add permission':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Remove permission':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Add balance':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Remove balance':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Supsesion':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Unsupsesion':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Order canceled':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Bot join':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'Bot leave':
                config[`${category}`] = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            default:
                break;
        }

        fs.writeFileSync('./src/data/guilds.json', JSON.stringify(file, null, 4), 'utf8');

        fs.readFile('./src/data/guilds.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data);
                //client.config = obj; kurca annyat xdd
            }
        });

        interaction.editReply({ content: "Successfully set the value! `✔️`\nCategory: **" + category + "** Value: `" + interaction.options.getString('value') + "`", ephemeral: true });

        if (category == 'developed_by_answ3r2') return;
        if (category == 'elvalaszto2') return;

    }
};

