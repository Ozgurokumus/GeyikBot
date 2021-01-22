module.exports = async function (message, tokens) {
    // Await !vote messages
    const opponentFilter = m => m.content.startsWith("!me") && m.author.username == message.author.username;

    // Errors: ['time'] treats ending because of the time limit as an error
    message.channel.send("**" + message.author.username + "** wants to play, who else?").then(() => {
        message.channel.awaitMessages(opponentFilter, {
                max: 1,
                time: 10000,
                errrors: ['time']
            })
            .then(collected => {
                message.channel.send("**" + message.author.username + "** accepted to play!!");
            })
    });


    // message.channel.send("\`ROCK\` \`PAPER\` \`SCISSORS\`").then(() => {
    //     message.channel.awaitMessages(filter, {
    //             max: 4,
    //             time: 10000,
    //             errors: ['time']
    //         })
    //         .then(collected => {
    //             console.log(collected.size);
    //             console.log(collected);
    //         })
    //         .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
    // })
}