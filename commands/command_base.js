const Guild = require('../models/guild');
const bot = require('../package.json');
const validatePermissions = (userPermissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
        'MODERATE_MEMBERS',
    ]

    for (const permission of userPermissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`)
        }
    }
}

const allCommands = {}

module.exports = (commandOptions) => {
    let {
        commands,
        userPermissions = [],
    } = commandOptions
    if (typeof commands === 'string') {
        commands = [commands]
    }
    if (userPermissions.length) {
        if (typeof userPermissions === 'string') {
            userPermissions = [userPermissions]
        }

        validatePermissions(userPermissions)
    }
    for (const command of commands) {
        allCommands[command] = {
            ...commandOptions,
            commands,
            userPermissions,
        }
    }
}
module.exports.listen = (client) => {
    client.on('messageCreate', async (message) => {
        const { member, content, guild } = message
        const guildSettings = await Guild.findOne({
            guildID: guild.id
        })
        if(!guildSettings) {
            return message.channel.send({ content: "An unknown error occurred, please try again. If this error persists please join our support server." }).catch(err => console.log(err));
        }
        const prefix = guildSettings.prefix;
        // Split on any number of spaces
        const args = content.split(/[ ]+/)

        // Remove the command which is the first index
        const name = args.shift().toLowerCase();
        if (name.startsWith(prefix)) {
            const command = allCommands[name.replace(prefix, '')]
            if (!command) {
                return
            }
                const { 
                    userPermissions, 
                    permissionError = 'You do not have permission to execute this command.', 
                    requiredRoles = [], 
                    minArgs = 0,
                    maxArgs = null,
                    expectedArgs = [],
                    callback,
             } = command
                // A command has been ran

                // Ensure the user has the required permissions
                for (const permission of userPermissions) {
                    if (!member.permissions.has(userPermissions)) {
                        message.reply({ content: permissionError }).catch(err => console.log(err));
                        return
                    }
                }

                // Ensure the user has the required roles
                for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(
                        (role) => role.name === requiredRole
                    )

                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply({
                            content: `You must have the "${requiredRole}" role to use this command.`
                        }).catch(err => console.log(err));
                        return
                    }
                }

                // Ensure we have the correct number of args
                if (
                    args.length < minArgs ||
                    (maxArgs !== null && args.length > maxArgs)
                ) {
                    message.reply({
                        content: `Incorrect syntax! Use ${name} ${expectedArgs}`
                    }).catch(err => console.log(err));
                    return
                }

                // Handle the custom command code
                callback(client, bot, message, args, args.join(' '), client).catch(err => console.log(err));
        }
    });
}