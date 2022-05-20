const { MessageEmbed } = require('discord.js');
const Guild = require('../../models/guild');
const Config = require("../../models/config");
const ms = require('ms');
module.exports = {
    commands: ['lockdown', 'ld'],
    minArgs: 0,
    maxArgs: 2,
    cooldown: 5,
    userPermissions: ["MANAGE_MESSAGES"],
    expectedArgs: "(#Channel || all)",
    callback: async (client, bot, message, args, text) => {
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id
        })
        const channel = message.mentions.channels.first() || message.guild.channels.cache.find(c => c.id === args[0])
        channel.permissionOverwrites.edit(channel.guild.id, {
            SEND_MESSAGES: false,
        });
        if(!args[0]) {

        } else {
            if(channel) {
                let reason = args.slice(1).join(" ")
                if (!reason) { reason = "No reason provided" }
                if (reason.length > 250) { return message.channel.send({ content: "Reason exceeds maximum size! (250 Characters)" }) } 
            }
        }

    },
}