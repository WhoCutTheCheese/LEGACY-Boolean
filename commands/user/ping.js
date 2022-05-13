module.exports = {
    commands: ['ping', 'latency', 'p'],
    minArgs: 0,
    maxArgs: 0,
    callback: async (client, bot, message, args, text) => {
        const pingMessage = await message.reply({ content: "🔃 Calculating..." }).then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
            resultMessage.edit({ content: `<:check:966796856975835197> Bot Latency: **${ping}ms**, API Latency: **${client.ws.ping}ms**` })
        })
    },
}