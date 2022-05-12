const Guild = require("../../models/guild");
const { Permissions, MessageEmbed } = require('discord.js')
module.exports = {
    commands: ["color", "c"],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "[Hex code]",
    cooldown: 0,
    userPermissions: [ 'MANAGE_GUILD' ],
    callback: async (client, bot, message, args, text) => {
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id
        })
        if(guildSettings.premium === false) { return message.channel.send({ content: "This command is for premium users only! Feel free to support Boolean by buying premium!" })}
        if (args[0] === "reset") {
            await Guild.findOneAndUpdate({
                guildID: message.guild.id,
            }, {
                color: "5865F2"
            })
            const resetEmbed = new MessageEmbed()
                .setTitle("Embed Color")
                .setColor("5865F2")
                .setDescription(`Embed Color for ${message.guild.name} has been changed to #5865F2`)
            return message.channel.send({ embeds: [resetEmbed] })
        }
        let testThing = /[0-9A-Fa-f]{6}/g;
        if(!args[0].startsWith("#")) { return message.channel.send({ content: "That is an invalid hex code!" }) }
        let testingcolor = args[0].replace('#', '').toUpperCase();
        var inputString = testingcolor;
        if(!testThing.test(inputString)) {
            return message.channel.send({ content: "That is an invalid hex code!" })
        }

        await Guild.findOneAndUpdate({
            guildID: message.guild.id,
        }, {
            color: inputString
        })
        const resetEmbed = new MessageEmbed()
            .setTitle("Embed Color")
            .setColor(inputString)
            .setDescription(`Embed Color for ${message.guild.name} has been changed to #${inputString}`)
        return message.channel.send({ embeds: [resetEmbed] })
    },
}