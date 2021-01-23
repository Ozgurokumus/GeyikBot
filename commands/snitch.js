const Discord = require('discord.js');


module.exports = async function (message, tokens) {

    let playerSet = new Set();
    let playerList;

    let playerAwait;
    const filter = (reaction, user) => {
        return ["🖐", "✅"].includes(reaction.emoji.name) && user.id != "799787185402019880";
    };

    message.channel.send("**Who wants to play snitch!**").then(whoWants => {
        whoWants.react("🖐").then(() => whoWants.react("✅"));
        return whoWants;
    }).then((whoWants) => {
        playerAwait = whoWants.createReactionCollector(filter, {
            time: 20000
        });

        playerAwait.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            playerSet.add(user);

            if (reaction.emoji.name == "✅") {
                playerAwait.stop("Anandan dolayı");
            }
        });

        playerAwait.on('end', collected => {
            console.log(`Collected ${collected.size} items\nPlayer set len:${playerSet.size}`);
            if (playerSet.size > 1) {
                playerList = Array.from(playerSet);
                let questioner = playerList[Math.floor(Math.random() * playerList.length)];
                messageSomeonePriv(questioner, playerList, message.channel);

            }
        });
    });

}


function messageSomeonePriv(questioner, playerList, channel) {
    console.log("Trying to privmessage");

    // let playerListCopy = [...playerList];

    // const index = playerList.indexOf(questioner);
    // if (index > -1) {
    //     playerList.splice(index, 1);
    // }

    let playerFields = [];
    for (let i = 0; i < playerList.length; i++) {
        let field = {
            name: playerList[i].username,
            value: i.toString(),
            inline: true
        }

        playerFields.push(field);
    }

    let embedAllPlayers = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Select someone below in 120 Seconds')
        .addFields(playerFields)
        .setTimestamp()
        .setFooter('Created by #poxlr2422');

    const isNumericFilter = (m) => isNumeric(m.content.trim());
    let privCollector;

    let askingToIdx;
    let askingQuestion;

    questioner.send(embedAllPlayers).then((privM) => {
        privCollector = privM.channel.createMessageCollector(isNumericFilter, {
            max: 1,
            time: 15000
        });

        privCollector.on('collect', m => {
            askingToIdx = parseInt(m.content);
            console.log(`Collected ${m.content}`);

            const filter2 = (m) => true;
            questioner.send(`What do you want to ask to ${playerList[askingToIdx]}, it will be anonymous😉\nPlease answer in ${15} seconds`).then((privM2) => {
                let privCollector2 = privM2.channel.createMessageCollector(filter2, {
                    max: 1,
                    time: 15000
                });

                privCollector2.on('collect', m => {
                    console.log(`Your question to ${playerList[askingToIdx]} is ${m.content}`);
                    askingQuestion = m.content;

                    playerList[askingToIdx].send(`An anonymous user asked you\n**${askingQuestion}** ,who is your answer?`);

                    let answerAllPlayers = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Select someone below in 120 Seconds')
                        .addFields(playerFields)
                        .setTimestamp()
                        .setFooter('Created by #poxlr2422');


                    playerList[askingToIdx].send(answerAllPlayers).then((privM3) => {
                        let privCollector3 = privM3.channel.createMessageCollector(isNumericFilter, {
                            max: 1,
                            time: 120000
                        });

                        privCollector3.on('collect', m => {
                            console.log(`Answer is ${playerList[m.content]}`);
                            channel.send(`A question is asked and ${playerList[askingToIdx]} said the answer is ${playerList[m.content]}\nNow they will play Rock Paper Scissors`);
                        });
                    });
                });
            });
        });
    });

}

function fieldsExcluding(list, excludeName) {
    let index;
    for (let i = 0; i < list.length; i++) {
        if (list[i].username == excludeName) {
            index = i;
        }
    }

    if (index > -1) {
        list.splice(index, 1);
        console.log(list);
    }

    let fields = [];
    for (let i = 0; i < list.length; i++) {
        let field = {
            name: list[i].username,
            value: i.toString(),
            inline: true
        }

        list.push(field);
    }
    console.log(fields);
    return fields;
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

//⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ Özgürün alanı ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇

function startPvpRpsBetween(user1, user2) {
    return; //-1 if user1 wins, 0 if draw, 1 if user2 wins
}