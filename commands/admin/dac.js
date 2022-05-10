const { Client, Message, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction } = require('discord.js');
const Guild = require("../../models/guild");
const Cases = require("../../models/cases");
module.exports = {
    commands: ['deleteallcases', 'clearallcases', 'wipeallcases', 'dac'],
    maxArgs: 0,
    minargs: 0,
    callback: async (client, bot, message, args, text) => {
        if (message.author.id !== message.guild.ownerId) { return message.channel.send({ content: "You cannot use this!" }) }

        const invite = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("CONFIRM")
                .setStyle("DANGER")
                .setCustomId(`confirm.${message.author.id}`),
        )
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id,
        })
        const deleteallcasesEmbed = new MessageEmbed()
            .setTitle("Delete All Cases?")
            .setColor(guildSettings.color)
            .setDescription("**WARNING** This will delete all case files stored by Boolean. This means that Boolean will NOT be able to fetch old punishments after clicking confirm.")
        message.channel.send({ embeds: [deleteallcasesEmbed], components: [invite] }).then(resultMessage => {
            const filter = (Interaction) => {
                if (Interaction.user.id === message.author.id) return true;
            }
            const Buttoncollector = resultMessage.createMessageComponentCollector({
                filter,
                time: 15000
            })

            Buttoncollector.on('collect', async (i) => {
                await i.deferUpdate()
                const id = i.customId
                if (id === `confirm.${i.user.id}`) {
                    invite.components[0].setDisabled(true)
                    const deleteallcasesEmbed = new MessageEmbed()
                        .setTitle("Delete All Cases")
                        .setColor(guildSettings.color)
                        .setDescription("Boolean has deleted all case files in this guild!")
                    resultMessage.edit({ embeds: [deleteallcasesEmbed], components: [invite] }).catch(err => console.log(err))
                    await Cases.deleteMany({
                        guildID: message.guild.id,
                    })
                    await Guild.updateOne({
                        guildID: message.guild.id,
                    }, {
                        totalCases: 0,
                    })
                }
            })
        }).catch(err => console.log(err))
    },
}