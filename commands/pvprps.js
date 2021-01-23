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

    message.channel.send("**Who wants to play rock paper scissors?**")
        .then(playW => {
            playW.react("🖐").then(() => {
                collector = playW.createReactionCollector(opponentFilter, {
                    max: 2,
                    time: 60000
                })

                let answers = {};

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

                            console.log(user.toString() + " said " + react.emoji.name);
                            answers[user.username] = react.emoji.name;

                            if (Object.keys(answers).length == 2) {

                                let p1 = emojis.indexOf(answers[Object.keys(answers)[0]]);
                                let p2 = emojis.indexOf(answers[Object.keys(answers)[1]]);

                                let p1Name = Object.keys(answers)[0];
                                let p2Name = Object.keys(answers)[1];

                                //When both players played their moves
                                let emojiText = `${Object.keys(answers)[0]} - ${emojis[p1]}\n${Object.keys(answers)[1]} - ${emojis[p2]}`;

                                if (p1 == p2) {
                                    // Draw
                                    createEmbed(true, "X", message.channel, emojiText);
                                } else if ((p2 + 1) % 3 == p1) {
                                    // Player1 win
                                    createEmbed(false, p1Name, message.channel, emojiText);
                                } else {
                                    // Player2 win
                                    createEmbed(false, p2Name, message.channel, emojiText);
                                }
                            }
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

function createEmbed(draw, whoWin, channel, emojis) {
    let colorCode = (draw ? "#91A6A6" : "#00D166");

    let text = (draw ? ("** Draw! **") : ("**" + whoWin + "** won!"));
    // inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor(colorCode)
        .setURL("https://discord.js.org/")
        .addFields({
            name: text,
            value: emojis
        })

    channel.send(exampleEmbed);
}