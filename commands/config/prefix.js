const Guild = require("../../models/guild");
const { Permissions, MessageEmbed } = require('discord.js')
module.exports = {
    commands: ["prefix", "p"],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "[Prefix]",
    cooldown: 10,
    userPermissions: [ 'MANAGE_GUILD' ],
    callback: async (client, bot, message, args, text) => {
        const settings = await Guild.findOne({
            guildID: message.guild.id
        });

        if (args[0] === "reset") {
            await settings.updateOne({
                prefix: "!!"
            })
            const resetPrefix = new MessageEmbed()
                .setTitle("Prefix")
                .setColor(settings.color)
                .setDescription("Guild prefix has been updated to `!!`")
            message.channel.send({ embeds: [resetPrefix] })
        } else {
            if (args[0].length > 3) {
                return message.channel.send({ content: "Prefix exceeds character limit (3)" })
            } else {
                await settings.updateOne({
                    prefix: args[0]
                });
                const setPrefix = new MessageEmbed()
                    .setTitle("Prefix")
                    .setColor(settings.color)
                    .addField("Prefix Updated", `Guild prefix has been updated to \`${args[0]}\``)
                    .setTimestamp()
                return message.channel.send({ embeds: [setPrefix] });
            }
        }

    },
}