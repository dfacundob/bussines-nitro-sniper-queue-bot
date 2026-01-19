const fs = require('fs');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const { customId, values, guild, member } = interaction; // you need to destructure values from interaction first to use it below
        if (interaction.isChatInputCommand()) {
            //client.config = JSON.parse(fs.readFileSync('./config.json'));
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isUserContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
            }
            command.execute(interaction, client);
        } else {
            return;
        }
    }
};