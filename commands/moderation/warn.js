const _ = require("lodash");
const Guild = require("../../models/guild");
const Cases = require("../../models/cases");
const { Client, Message, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction } = require('discord.js');
module.exports = {
    commands: ['warn', 'w'],
    minArgs: 1,
    expectedArgs: "[@User/User ID] (Reason)",
    cooldown: 1,
    userPermissions: ["MANAGE_MESSAGES"],
    callback: async (client, bot, message, args, text) => {
        let warnUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!warnUser) { return message.channel.send({ content: "I was unable to find that user!" }) }
        let reason = args.slice(1).join(" ")
        if(!reason) { reason = "No reason provided" }
        if(reason.length > 250) { return message.channel.send({ content: "Reason exceeds maximum size! (250 Characters)" }) }
        if(warnUser.id === message.author.id) { return message.channel.send({ content: "You cannot issue punishments to yourself." }) }
        if(warnUser.bot)  { return message.channel.send({ content: "You cannot issue punishments to bots." }) }
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id,
        })
        const warns = await Cases.countDocuments({
            guildID: message.guild.id,
            userID: muteUser.id,
            caseType: "Warn",
        })
        const caseNumberSet = guildSettings.totalCases + 1;
        const newCases = await new Cases({
            guildID: message.guild.id,
            userID: warnUser.id,
            modID: message.author.id,
            caseType: "Warn",
            caseReason: reason,
            caseNumber: caseNumberSet,
            caseLength: "None",
        })
        newCases.save().catch()
        await Guild.findOneAndUpdate({
            guildID: message.guild.id,
        }, {
            totalCases: caseNumberSet,
        })
        const warnEmbed = new MessageEmbed()
            .setDescription(`**Case:** #${caseNumberSet} | **Mod:** ${message.author.tag} | **Reason:** ${reason}`)
            .setColor(guildSettings.color)
        message.channel.send({ content: `<:arrow_right:967329549912248341> **${warnUser.user.tag}** has been warned (Warns **${warns}**)`, embeds: [warnEmbed] })

        
    },
}