const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the bot.')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category to set up.')
                .setRequired(true)
                .addChoices(
                    { name: 'Developed by 💕 .answ3r', value: 'developed_by_answ3r' },
                    { name: '-------------( Lifetime Settings )------------', value: 'elvalaszto' },
                    { name: 'Lifetime Role', value: 'lifetime_role' },
                    { name: 'Lifetime Claims', value: 'lifetime_claims' },
                    { name: '-------------( Bank Settings )------------', value: 'elvalaszto' },
                    { name: '1 claim price', value: '1claim_p' },
                    { name: '-------------( Reseller Settings )------------', value: 'elvalaszto' },
                    { name: 'Reseller Role', value: 'rs_role' },
                    { name: 'Reseller Queue Embed Channel', value: 'rs_queue' },
                    { name: '------------( Sniper Settings )----------', value: 'elvalaszto' },
                    { name: 'Sniper Empty Claim Token', value: 'sniper_empty_claim_token' },
                    { name: 'Sniper Successfil Channel', value: 'sniper_successfil_channel' },
                    { name: 'Sniper Failed Channel', value: 'sniper_failed_channel' },
                    { name: 'Sniper Queue Rotate (true/false)', value: 'sniper_queue_rotate' },
                    { name: 'Stats Channel', value: 'stats_channel' },
                ))
        .addStringOption(option =>
            option.setName('value')
                .setDescription('The value to set.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits[8]),
    async execute(interaction, client) {
        if (client.utils.home_permCheck(interaction, client) == false) return;

        await interaction.deferReply({ ephemeral: true });

        var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        var category = interaction.options.getString('category');

        switch (category) {
            case 'developed_by_answ3r':
                interaction.editReply({ content: "Developed by 💕 .answ3r https://store.answ3r.hu/", ephemeral: true });
                break;
            case 'elvalaszto':
                interaction.editReply({ content: "You stupid idiot, you can't set this value!", ephemeral: true });
                break;
            case 'sniper_empty_claim_token':
                config["Sniper Settings"].emptyQueueClaimToken = interaction.options.getString('value');
                break;
            case 'sniper_successfil_channel':
                config["Sniper Settings"].successfulChannelId = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'sniper_failed_channel':
                config["Sniper Settings"].failedChannelId = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'sniper_queue_rotate':
                if (interaction.options.getString('value') == "true") {
                    config["Sniper Settings"].QueueRotate = true;
                } else if (interaction.options.getString('value') == "false") {
                    config["Sniper Settings"].QueueRotate = false;
                } else {
                    config["Sniper Settings"].QueueRotate = false;
                }
                break;
            case 'stats_channel':
                config.Stats.channelId = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'rs_queue':
                config.Notification.resellerQueue = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'lifetime_claims':
                config.Notification.lifetimeClaims = parseInt(interaction.options.getString('value'));
                break;
            case 'lifetime_role':
                config.Notification.lifetimeRole = interaction.options.getString('value').replace("<@&", "").replace(">", "");
                break;
            case 'rs_role':
                config.Notification.resellerRole = interaction.options.getString('value').replace("<@&", "").replace(">", "");
                break;
            case '1claim_p':
                config['Bank Settings']['1claim price'] = parseInt(interaction.options.getString('value'));
            default:
                break;
        }

        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4), 'utf8');

        fs.readFile('./config.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data);
                client.config = obj;
            }
        });

        if (category == 'developed_by_answ3r') return;
        if (category == 'elvalaszto') return;

        interaction.editReply({ content: "Successfully set the value! `✔️`\nCategory: **" + category + "** Value: `" + interaction.options.getString('value') + "`", ephemeral: true });


        client.utils.StatEmbedUpdate(client);
    }
};

