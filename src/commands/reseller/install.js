const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const isValidHex = hex => /^#(([0-9A-Fa-f]{2}){3,4}|[0-9A-Fa-f]{3})$/.test(hex);

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('install')
        .setDescription('Sets up the bot.')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category to set up.')
                .setRequired(true)
                .addChoices(
                    { name: 'Developed by 💕 .answ3r', value: 'developed_by_answ3r2' },
                    { name: '-------------( Bot Settings )------------', value: 'elvalaszto2' },
                    { name: 'Log Channel', value: 'log_channel2' },
                    { name: '--------( Public Claim Settings )--------', value: 'elvalaszto2' },
                    { name: 'Nitro Emoji', value: 'nitro_emoji2' },
                    { name: 'Nitro Basic Emoji', value: 'nitro_basic_emoji2' },
                    { name: 'Nitro Reaction Emoji', value: 'nitro_reaction_emoji2' },
                    { name: 'Ping Role', value: 'ping_role2' },
                    { name: 'Customer Role', value: 'customer_role2' },
                    { name: 'New Claim Notification Channel', value: 'new_claim_notification_channel2' },
                    { name: 'New Order Notification Channel', value: 'new_order_notification_channel2' },
                    { name: '---------( Queue Embed Settings )--------', value: 'elvalaszto2' },
                    { name: 'Queue Embed Channel', value: 'queue_embed_channel2' },
                    { name: 'Queue Embed Color', value: 'queue_embed_color2' },
                    { name: 'Queue Embed Progress Emoji', value: 'queue_embed_progress_emoji2' },
                    { name: 'Queue Embed Waiting Emoji', value: 'queue_embed_waiting_emoji2' },
                    { name: 'Queue Embed Boost Emoji', value: 'queue_embed_boost_emoji2' },
                    { name: '---------( Bank Embed Settings )--------', value: 'elvalaszto2' },
                    { name: 'Bank Embed Channel', value: 'bank_embed_channel2' },
                    { name: 'Bank Embed Color', value: 'bank_embed_color2' },
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
            case 'nitro_emoji2':
                config.nitro_emoji = interaction.options.getString('value');
                break;
            case 'nitro_basic_emoji2':
                config.nitro_basic_emoji = interaction.options.getString('value');
                break;
            case 'nitro_reaction_emoji2':
                config.nitro_reaction_emoji = interaction.options.getString('value');
                break;
            case 'ping_role2':
                config.ping_role = interaction.options.getString('value').replace("<@&", "").replace(">", "");
                break;
            case 'customer_role2':
                config.customer_role = interaction.options.getString('value').replace("<@&", "").replace(">", "");
                break;
            case 'new_claim_notification_channel2':
                config.new_claim_notification_channel = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'new_order_notification_channel2':
                config.new_order_notification_channel = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'queue_embed_channel2':
                config.queue_embed_channel = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'queue_embed_color2':
                if (isValidHex(interaction.options.getString('value'))) {
                    config.queue_embed_color = interaction.options.getString('value');
                } else {
                    interaction.editReply({ content: "You stupid idiot, you can't set this value!\n### A hex code must be entered here!", ephemeral: true });
                    return;
                }
                break;
            case 'queue_embed_progress_emoji2':
                config.queue_embed_progress_emoji = interaction.options.getString('value');
                break;
            case 'queue_embed_waiting_emoji2':
                config.queue_embed_waiting_emoji = interaction.options.getString('value');
                break;
            case 'queue_embed_boost_emoji2':
                config.queue_embed_boost_emoji = interaction.options.getString('value');
                break;
            case 'bank_embed_channel2':
                config.bank_embed_channel = interaction.options.getString('value').replace("<#", "").replace(">", "");
                break;
            case 'bank_embed_color2':
                if (isValidHex(interaction.options.getString('value'))) {
                    config.bank_embed_color = interaction.options.getString('value');
                } else {
                    interaction.editReply({ content: "You stupid idiot, you can't set this value!\n### A hex code must be entered here!", ephemeral: true });
                    return;
                }
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

        if (category == 'bank_embed_channel2') {
            client.utils.BankEmbedUpdate(client);
            interaction.editReply({ content: "Successfully set the value! `✔️`\nCategory: **" + category + "** Value: `" + interaction.options.getString('value') + "`\n\n`🔄️` **The bank embed will be sent soon! Please wait.**", ephemeral: true });
            //console.log('Success TE GECI'.red)
        } else if (category == 'queue_embed_channel2') {
            client.utils.checkQueue(client);
            interaction.editReply({ content: "Successfully set the value! `✔️`\nCategory: **" + category + "** Value: `" + interaction.options.getString('value') + "`\n\n`🔄️` **The queue embed will be sent soon! Please wait.**", ephemeral: true });
            //console.log('Success TE GECI2'.red)
        }


        if (category == 'developed_by_answ3r2') return;
        if (category == 'elvalaszto2') return;

    }
};
