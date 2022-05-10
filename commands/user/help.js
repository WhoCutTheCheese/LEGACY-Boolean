const { Client, Message, MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction, Interaction, MessageFlags, MessageSelectMenu } = require('discord.js');
const Guild = require("../../models/guild");
module.exports = {
    commands: ['help'],
    minArgs: 0,
    maxArgs: 1,
    callback: async (client, bot, message, args, text) => {
        const guildSettings = await Guild.findOne({
            guildID: message.guild.id
        })
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`help-menu.${message.author.id}`)
                .setPlaceholder("Select a command category!")
                .addOptions([{
                    label: "User Commands",
                    value: "first",
                    emoji: "🎮",
                }, {
                    label: "Mod Commands",
                    value: "second",
                    emoji: "🔨",
                }, {
                    label: "Config Commands",
                    value: "third",
                    emoji: "⚙",
                }, {
                    label: "Admin Commands",
                    value: "forth",
                    emoji: "☄",
                }, {
                    label: "Change Log",
                    value: "fifth",
                    emoji: "⬆",
                }
                ]))

        const chingChong = new MessageEmbed()
            .setTitle("<:tasklist:967443053063327774> Help\n")
            .setDescription("<a:coin:893603823459905536> **[Premium](https://google.com)** | :newspaper: **[Features](https://google.com/)** | <:bughuntergold:967441675507105842> **[Support Server](https://discord.gg/VD4sf98hKd)**")
            .addField("Current Guild Settings", `Prefix: \`${guildSettings.prefix}\`\nEmbed Color: \`#${guildSettings.color}\`\nPremium Status: \`${guildSettings.premium}\``)
            .setColor(guildSettings.color)
            .addField("User Commands", "`ping`, `userinfo`, `serverinfo`, `avatar`, `botinfo`, `invite`, `help`")
            .addField("Moderation Commands", "`warn`, `mute`, `kick`, `ban`, `history`, `purge`, `lockdown`, `unlockdown`, `delcase`, `slowmode`, `nickname`")
            .addField("Config Commands", "`prefix`, `color`, `check`, `permission`, `modlogset`, `muterole`")
            .addField("Administration Commands", "`deleteallcases`, `premium`")
            .setFooter({ text: `${message.guild.name} - v${bot.version}`, iconURL: message.guild.iconURL({ dynamic: true }) })
        message.channel.send({ embeds: [chingChong], components: [row] }).then(resultMessage => {
            const filter = (Interaction) => {
                if (Interaction.user.id === message.author.id) return true;
            }
            const Buttoncollector = resultMessage.createMessageComponentCollector({
                filter,
                componentType: "SELECT_MENU",
                time: 15000,
            })
            Buttoncollector.on('end', () => {
                row.components[0].setDisabled(true)
                resultMessage.edit({ components: [row] })
            })
            Buttoncollector.on('collect', async (i) => {
                await i.deferUpdate()
                switch (i.values[0]) {
                    case "first":
                        const userCommands = new MessageEmbed()
                            .setTitle("🎮 User Commands")
                            .setColor(guildSettings.color)
                            .setDescription("List of commands that are accessable by every user!\nRun `help [Command]` to get information about a command.")
                            .addField("Commands 1/1", "<:arrow_right:967329549912248341> **Ping** - Display API and Bot latency\n<:arrow_right:967329549912248341> **Userinfo** - Display info on a user\n<:arrow_right:967329549912248341> **Serverinfo** - Display info on the guild\n<:arrow_right:967329549912248341> **Avatar** - Display a user's avatar\n<:arrow_right:967329549912248341> **Botinfo** - Display info on Boolean\n<:arrow_right:967329549912248341> **Invite** - Invite Boolean\n<:arrow_right:967329549912248341> **Help** - Help menu", true)
                        resultMessage.edit({
                            embeds: [userCommands],
                            components: [row],
                        })
                        break;
                    case "second":
                        const modCommands = new MessageEmbed()
                            .setTitle("🔨 Moderation Commands")
                            .setColor(guildSettings.color)
                            .setDescription("List of powerful moderation commands to keep your users in check!\nRun `help [Command]` to get information about a command.")
                            .addField("Commands 1/2", "<:arrow_right:967329549912248341> **Warn** - Issue a warning to a user\n<:arrow_right:967329549912248341> **Mute** - Mute a user\n<:arrow_right:967329549912248341> **Kick** - Kick a user\n<:arrow_right:967329549912248341> **Ban** - Ban a user\n<:arrow_right:967329549912248341> **History** - View a user's cases\n<:arrow_right:967329549912248341> **Purge** - Bulk delete messages", true)
                            .addField("Commands 2/2", "<:arrow_right:967329549912248341> **Lockdown** - Removes talk for @everyone\n<:arrow_right:967329549912248341> **Unlockdown** - Adds talk for @everyone\n<:arrow_right:967329549912248341> **Delcase** - Delete a case\n<:arrow_right:967329549912248341> **Slowmode** - Add slowmode to channel\n<:arrow_right:967329549912248341> **Nickname** - Change a user's nick\n<:arrow_right:967329549912248341> **Reason** - Change the reason of a case", true)
                        resultMessage.edit({
                            embeds: [modCommands],
                            components: [row],
                        })
                        break;
                    case "third":
                        const configCommands = new MessageEmbed()
                            .setTitle("⚙ Configuration Commands")
                            .setColor(guildSettings.color)
                            .setDescription("List of commands to setup Boolean!\nRun `help [Command]` to get information about a command.")
                            .addField("Commands 1/1", "<:arrow_right:967329549912248341> **Prefix** - Set Boolean's prefix\n<:arrow_right:967329549912248341> :coin: **Color** - Change Boolean's embed color\n<:arrow_right:967329549912248341> **Check** - Check what permissions Boolean needs to work\n<:arrow_right:967329549912248341> **Permission** - Set permissions for command/categories\n<:arrow_right:967329549912248341> **Modlogset** - Set the mod logging channel\n<:arrow_right:967329549912248341> **Muterole** - Set the mute role", true)
                        resultMessage.edit({
                            embeds: [configCommands],
                            components: [row],
                        })
                        break;
                    case "forth":
                        const adminCommands = new MessageEmbed()
                            .setTitle("☄ Administration Commands")
                            .setColor(guildSettings.color)
                            .setDescription("List of powerful commands only Administrators have access to!\nRun `help [Command]` to get information about a command.")
                            .addField("Commands 1/1", "<:arrow_right:967329549912248341> 🛑 **Deleteallcases** - Deletes all case files stored by Boolean\n<:arrow_right:967329549912248341> :coin: **Premium** - Activate premium", true)
                        resultMessage.edit({
                            embeds: [adminCommands],
                            components: [row],
                        })
                        break;
                    case "fifth":
                        const changeLog = new MessageEmbed()
                            .setTitle("📰 Change Log")
                            .setColor(guildSettings.color)
                            .setDescription(`**Boolean - v${bot.version}** | Release\n\nNothing here yet! Check out [wiki](https://google.com) for information on Boolean's features.`)
                        resultMessage.edit({
                            embeds: [changeLog],
                            components: [row],
                        })
                        break;
                }
            })
        })
    },
}