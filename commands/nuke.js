const Discord = require('discord.js');


module.exports = async function (message, tokens) {
    if (message.author.id == process.env.ADMINID) {
        let filter = m => m.author.id === message.author.id
        message.channel.send(`Are you sure to delete all data? \`YES\` / \`NO\``).then(() => {
            message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                })
                .then(message => {
                    message = message.first()
                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                        nukeChannel(message);
                    } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                        message.channel.send(`Good choice!`)
                    } else {
                        message.channel.send(`Terminated: Invalid Response`)
                    }
                })
                .catch(collected => {
                    console.log(collected);
                    message.channel.send('Timeout');
                });
        })

    }
}

function nukeChannel(m) {
    m.channel.clone()
        .then(clone => {
            console.log(`Cloned ${m.channel.name} to make a channel called ${clone.name}`);
            clone.send(`Channel Nuked`);
        })
        .catch(console.error);

    m.channel.delete()
        .then(clone => console.log(`Deleted ${m.channel.name} to make a channel called ${clone.name}`))
        .catch(console.error);
}