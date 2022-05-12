const {
    MessageEmbed
} = require('discord.js');
const mongoose = require('mongoose');
const Guild = require("../../models/guild");
const Tokens = require("../../models/tokens");
module.exports = {
    commands: ['givepremium'],
    minArgs: 2,
    maxArgs: 2,
    devOnly: true,
    expectedArgs: ['<@user/user ID> <token amount>'],
    callback: async (client, bot, message, args, text) => {
        let person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const settings = await Tokens.findOne({
            userID: person.id
        })
        if (isNaN(args[1])) {
            return message.channel.send({
                content: "Not a valid token amount"
            })
        }
        if (!settings) {
            const newTokens = await new Tokens({
                userID: person.id,
                userName: message.author.tag,
                tokens: (args[1]),
            })
            newTokens.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            message.channel.send({
                content: "Created a file & Gave that dude premium yea"
            })
        }
        if (settings) {
            const neweTokens = await Tokens.findOneAndUpdate({
                userID: person.id,
            }, {
                userID: person.id,
                userName: message.author.tag,
                tokens: neweTokens.tokens + args[1],
            })
            message.channel.send({
                content: "Did NOT create a file & Gave that dude premium yea"
            })
        }


    }
}