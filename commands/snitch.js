const Discord = require('discord.js');


module.exports = async function (message, tokens) {
    message.channel.send("**Who wants to play snitch!**").then(whoWants => {
        whoWants.react("🖐").then(() => whoWants.react("✅"));
        return whoWants;
    }).then((whoWants) => {
        whoWants.awaitReactions(filter, {
            max: 1,
            time: 60000,
            errors: ["time"]
        }).then(() => {

        })
    });
}