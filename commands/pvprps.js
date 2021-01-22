const Discord = require('discord.js');


module.exports = async function (message, tokens) {
    const emojis = ["🗻", "📜", "✂"];

    //This needs to be != after testing
    const opponentFilter = (reaction, user) => {
        return reaction.emoji.name === '🖐' && user.id != "799787185402019880";
    };

    const privMesFilter = (reaction, user) => {
        return ["🗻", "📜", "✂"].includes(reaction.emoji.name) && user.id != "799787185402019880";
    };

    let collector;
    let dict = {};

    message.channel.send("Who wants to play with **" + message.author.username + "**?")
        .then(playW => {
            playW.react("🖐").then(() => {
                collector = playW.createReactionCollector(opponentFilter, {
                    max: 2,
                    time: 60000
                })

                collector.on('collect', (reaction, user) => {
                    //Send user private message
                    user.send("Select one while your opponent does the same!").then(privM => {
                        privM.react("🗻").then(() => privM.react("📜")).then(() => privM.react("✂"));
                        return privM;
                    }).then((privM) => {
                        privM.awaitReactions(privMesFilter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                        }).then((collected) => {
                            const react = collected.first();

                            message.channel.send(user.toString() + " said " + react.emoji.name);
                            console.log(user.toString() + " said " + react.emoji.name);
                        });
                    }).catch((e) => {
                        console.log("HERE2" + e);
                    });

                    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                })
            }).catch((e) => {
                console.log("HERE3" + e);
            });
        }).catch((e) => {
            console.log("HERE4" + e);
        });


}
//     const filter = (reaction, user) => {
//         return ["🗻", "📜", "✂"].includes(reaction.emoji.name) && user.id === message.author.id;
//     };

//     message.awaitReactions(filter, {
//             max: 1,
//             time: 60000,
//             errors: ["time"]
//         })
//         .then(collected => {
//             const reaction = collected.first();

//             if (emojis.includes(reaction.emoji.name)) {
//                 let move = reaction.emoji.name;
//                 let playerIdx = emojis.indexOf(move); //console.log(emojis.indexOf(move));
//                 let botIdx = Math.floor(Math.random() * 3); //console.log(botIdx);              
//                 if (playerIdx == botIdx) {
//                     // Draw
//                     createEmbed(0, message.author.username, message.channel, emojis[botIdx]);
//                 } else if ((botIdx + 1) % 3 == playerIdx) {
//                     // Player win
//                     createEmbed(1, message.author.username, message.channel, emojis[botIdx]);
//                 } else {
//                     // Bot win
//                     createEmbed(-1, message.author.username, message.channel, emojis[botIdx]);
//                 }
//             } else {
//                 message.channel.send("Ne girdin yaw");
//             }
//         })
//         .catch(collected => {
//             message.reply("you reacted with neither a thumbs up, nor a thumbs down.");
//         });
// }

// function createEmbed(isWin, name, channel, emoji) {
//     let colorCode = (isWin == -1) ? "#FD0061" : ((isWin == 0) ? "#91A6A6" : "#00D166");
//     let text = (isWin == -1) ? ("** " + name + "** lose!") : ((isWin == 0) ? ("** Draw! **") : ("**" + name + "** win!"));
//     // inside a command, event listener, etc.
//     const exampleEmbed = new Discord.MessageEmbed()
//         .setColor(colorCode)
//         .setURL("https://discord.js.org/")
//         .addFields({
//             name: emoji,
//             value: text
//         })

//     channel.send(exampleEmbed);
// }