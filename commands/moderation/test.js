try {
    const _ = require("lodash");
    const Guild = require("../../models/guild");
    const Cases = require("../../models/cases");
    const { Client, Message, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction } = require('discord.js');
    module.exports = {
        commands: ['h', 'history'],
        minArgs: 1,
        expectedArgs: "(@User/User ID)",
        userPermissions: ["MANAGE_MESSAGES"],
        callback: async (client, bot, message, args, text) => {
            let histUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!histUser) { return message.channel.send({ content: "I was unable to find that user!" }) }
            let arr = [];
            const warnings = await Cases.find({
                userID: histUser.id,
                guildID: message.guild.id,
            })
            const guildSettings = await Guild.findOne({
                guildID: message.guild.id,
            })
            for (const warn of warnings) {
                arr.push(`\n\n**Case:** \`#${warn.caseNumber}\`\n**Type:** \`${warn.caseType}\`\n**Mod:** <@${warn.modID}>\n**Reason:** \`${warn.caseReason}\``)
            }
            const bitches = _.chunk(arr, 5)
            let numbers = 0
            if(bitches.length == 0) { return message.channel.send({ content: "No past punishments!" }) };
            const invite = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("")
                    .setStyle("SUCCESS")
                    .setEmoji('◀')
                    .setCustomId(`back.${message.author.id}`),
                new MessageButton()
                    .setLabel("")
                    .setStyle("SECONDARY")
                    .setEmoji('❌')
                    .setCustomId(`close.${message.author.id}`),
                new MessageButton()
                    .setLabel("")
                    .setStyle("SUCCESS")
                    .setEmoji('▶')
                    .setCustomId(`forward.${message.author.id}`),
            )
            const testEmbed = new MessageEmbed()
                .setAuthor({ name: `${histUser.user.tag}'s History`, iconURL: histUser.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${bitches[numbers]}`)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor(guildSettings.color)
            const waitingOmgUwU = message.channel.send({ embeds: [testEmbed], components: [invite] }).catch().then(resultMessage => {
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
                    if (id === `back.${i.user.id}`) {
                        if (numbers === 0) { return }
                        numbers = numbers - 1;
                        const testEmbed = new MessageEmbed()
                            .setAuthor({ name: `${histUser.user.tag}'s History`, iconURL: histUser.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`${bitches[numbers]}`)
                            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setColor(guildSettings.color)
                        resultMessage.edit({ embeds: [testEmbed], components: [invite] }).catch(err => console.log(err))
                    } else if (id === `forward.${i.user.id}`) {
                        if(numbers === bitches.length) { return }
                        numbers = numbers + 1;
                        const testEmbed = new MessageEmbed()
                            .setAuthor({ name: `${histUser.user.tag}'s History`, iconURL: histUser.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`${bitches[numbers]}`)
                            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setColor(guildSettings.color)
                        resultMessage.edit({ embeds: [testEmbed], components: [invite] }).catch(err => console.log(err))
                    } else if (id === `close.${i.user.id}`) {
                        invite.components[0].setDisabled(true)
                        invite.components[1].setDisabled(true)
                        invite.components[2].setDisabled(true)
                        const testEmbed = new MessageEmbed()
                            .setAuthor({ name: `${histUser.user.tag}'s History`, iconURL: histUser.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`${bitches[numbers]}`)
                            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setColor(guildSettings.color)
                        resultMessage.edit({ embeds: [testEmbed], components: [invite] }).catch(err => console.log(err))
                    }
                })
            }).catch(err => console.log(err))
        },
    }
} catch (err) {
    console.err(err)
}
