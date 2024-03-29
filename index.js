const {
    Client,
    Intents,
    Collection,
    Interaction,
    Permissions
} = require('discord.js');
const fs = require('fs');
const path = require("path");
const mongoose = require("mongoose");
const Guild = require('./models/guild');
const Tokens = require('./models/tokens');
const Config = require('./models/config');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
});
client.mongoose = require('./utils/mongoose.js')
client.on('ready', async () => {
    console.log("Boolean is coding the future...")
    client.user.setStatus('dnd')
    client.user.setActivity('The Aether | !!help', {
        type: "WATCHING",
    })
    const baseFile = 'command_base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(option)
            }
        }
    }

    readCommands('commands')
    commandBase.listen(client);
    console.log("Boolean has started!")
})



client.on('guildCreate', async guild => {
    const newGuild = new Guild({
        guildID: guild.id,
        guildName: guild.name,
        prefix: "!!",
        color: "5865F2",
        premium: false,
        premiumHolder: "None",
        totalCases: 0,
    })
    newGuild.save().catch(err => console.log(err));
    const Config = Config.findOne({
        guildID: guild.id,
    }, (err, config) => {
        if (err) console.error(err)
        if (!config) {
            const newConfig = new Config({
                _id: mongoose.Types.ObjectId(),
                guildID: guild.id,
                muteRoleID: "None",
                modLogChannel: "None",
                joinRoleID: "None",
            });
            newConfig.save()
                .catch(err => console.error(err))
        };
    });
})

client.on('guildDelete', async guild => {
    const guildS = await Guild.findOne({
        guildID: guild.id,
    })
    if (guildS.premium == true) {
        const tokens = await Tokens.findOne({
            userID: guildS.premiumHolder
        })
        await Tokens.findOneAndUpdate({
            userID: guildS.premiumHolder
        }, {
            tokens: tokens.tokens + 1
        })
        setTimeout(async function () {
            await Guild.findOneAndRemove({
                guildID: guild.id
            })
        }, 1000);
    } else if (guildS.premium == false) {
        await Guild.findOneAndRemove({
            guildID: guild.id
        })
    }
})

client.on('messageCreate', async message => {
    const guilds = Guild.findOne({
        guildID: message.guild.id,
    }, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                prefix: "!!",
                color: `5865F2`,
                premium: false,
                premiumHolder: "None",
                totalCases: 0,
            });
            newGuild.save()
                .catch(err => console.error(err))
        };
    });
    const config = Config.findOne({
        guildID: message.guild.id,
    }, (err, config) => {
        if (err) console.error(err)
        if (!config) {
            const newConfig = new Config({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                muteRoleID: "None",
                modLogChannel: "None",
                joinRoleID: "None",
            });
            newConfig.save()
                .catch(err => console.error(err))
        };
    });
});
client.mongoose.init();
client.login("OTY2NjM0NTIyMTA2MDM2MjY1.GKFLMY.Ox0Y1BMbNkxoqJa-AzYGccXiEheCdSyQgzV-dM");
//client.login(process.env.token);