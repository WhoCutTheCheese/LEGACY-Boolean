const { Client, Message, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction } = require('discord.js');
const Guild = require('../../models/guild');
const Cases = require('../../models/cases');
const Config = require('../../models/config');
module.exports = {
    commands: ['mute', 'm', 'silence'],
    minArgs: 1,
    maxArgs: 3,
    cooldown: 3,
    expectedArgs: "[@User/User ID] (Time || Reason) {Reason}",
    callback: async (client, bot, message, args, text) => {
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id,
        })
        let muteUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!muteUser) { return message.channel.send({ content: "I was unable to find that user!" }) }
        if(muteUser.id === message.author.id) { return message.channel.send({ content: "You cannot issue punishments to yourself." }) }
        if(muteUser.bot)  { return message.channel.send({ content: "You cannot issue punishments to bots." }) }
        if(!/^\d/.test(args[1])) { 
            let reason = args.slice(1).join(" ")
            if(!reason) { reason = "No reason provided" }
            if(reason.length > 250) { return message.channel.send({ content: "Reason exceeds maximum size! (250 Characters)" }) }
            const config = await Config.findOne({
                guildID: message.guild.id,
            })
            if(!config) { return message.channel.send({ content: "An unknown error occurred, contact support if this persists." }) }
            if(config.muteRoleID === "None") { return message.channel.send({ content: "You do not have a mute role!" }) }
            const muteRole = message.guild.roles.cache.get(config.muteRoleID)
            if(!muteRole) { return message.channel.send({ content: "Your mute role does not exist or has been deleted." }) }
            const caseNumberSet = guildSettings.totalCases + 1;
            const newCases = await new Cases({
                guildID: message.guild.id,
                userID: muteUser.id,
                modID: message.author.id,
                caseType: "Mute",
                caseReason: reason,
                caseNumber: caseNumberSet,
                caseLength: "None",
            })
            newCases.save().catch(err => console.log(err))
            await Guild.findOneAndUpdate({
                guildID: message.guild.id,
            }, {
                totalCases: caseNumberSet,
            })
            const warns = await Cases.countDocuments({
                guildID: message.guild.id,
                userID: muteUser.id,
            })
            muteUser.roles.add(muteRole);
            const muteEmbed = new MessageEmbed()
                .setDescription(`**Case:** #${caseNumberSet} | **Mod:** ${message.author.tag} | **Reason:** ${reason} | **Duration:** Permanent`)
                .setColor(guildSettings.color)
            message.channel.send({ content: `<:arrow_right:967329549912248341> **${muteUser.user.tag}** has been muted (Warns **${warns}**)`, embeds: [muteEmbed] })


         }
    },
}