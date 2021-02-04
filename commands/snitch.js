const Discord = require('discord.js');

module.exports = async function (message, tokens) {

    let playerSet = new Set();
    let playerList;

    let playerAwait;
    const filter = (reaction, user) => {
        return ["🖐", "✅"].includes(reaction.emoji.name) && (!user.bot);
    };

    message.channel.send("**Who wants to play snitch!** (Press 🖐 to join, press ✅ to start the game!)").then(whoWants => {
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
                playerAwait.stop("Starting the game!");
            }
        });

        playerAwait.on('end', collected => {
            console.log(`Collected ${collected.size} items\nPlayer set len:${playerSet.size}`);
            if ((playerSet.size > 1)) {
                startGameWithSet(playerSet, message.channel);
            }
            else{
                message.channel.send("Not enough players to start!");
                whoWants.delete();
            }
        });
    });
}

function startGameWithSet(playerSet, channel) {
    console.log(playerSet);
    endMessage(channel);
    playerList = Array.from(playerSet);
    let questioner = playerList[Math.floor(Math.random() * playerList.length)];
    messageSomeonePriv(questioner, playerList, channel, playerSet);
}

function messageSomeonePriv(questioner, playerList, channel, playerSet) {
    channel.send("An anonymous player is writing the question.")
    console.log("Trying to privmessage");

    let playerListForQuestioner = listDeleteUser(playerList, questioner.username);
    let playerFields = fieldsExcluding(playerList, questioner.username);

    let questionerAllPlayers = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Select someone below in 60 Seconds. Enter his/her number below.')
        .addFields(playerFields)

    
    const isNumericFilter = (m) => (isNumeric(m.content.trim())) && (0 <= parseInt(m.content.trim())) &&(parseInt(m.content.trim()) < playerListForQuestioner.length) && (parseInt(m.content.trim()) < playerListForQuestioner.length) && (!m.author.bot);
    const invalidFilter = (m) => ((!isNumeric(m.content.trim())) || (parseInt(m.content.trim()) >= playerListForQuestioner.length) || (parseInt(m.content.trim()) < 0)) && (!m.author.bot);
    let privCollector;
    let privCollectorError;
    let askingToIdx;
    let askingQuestion;



    questioner.send(questionerAllPlayers).then((privM) => {
        privCollector = privM.channel.createMessageCollector(isNumericFilter, {
            max: 1,
            time: 60000
        });

        privCollectorError = privM.channel.createMessageCollector(invalidFilter, {
            time: 60000
        });

        privCollector.on('collect', m => {
            privCollectorError.stop();
            askingToIdx = parseInt(m.content);
            console.log(`Collected ${m.content}`);

            console.log("Questioner Array: " + playerListForQuestioner);
            console.log("AskingToIdx: ", askingToIdx);
            const filter2 = (m) => true;
            questioner.send(`What do you want to ask to ${playerListForQuestioner[askingToIdx]}, it will be anonymous 😉\nPlease answer in ${120} seconds`).then((privM2) => {
                let privCollector2 = privM2.channel.createMessageCollector(filter2, {
                    max: 1,
                    time: 120000,
                });

                privCollector2.on('collect', m => {
                    channel.send("Waiting for the answer ...")
                    console.log(`Your question to ${playerListForQuestioner[askingToIdx]} is ${m.content}`);
                    askingQuestion = m.content;
                    playerListForQuestioner[askingToIdx].send(`An anonymous user asked you\n**${askingQuestion}**\nWho is your answer?`);

                    playerFields = fieldsExcluding(playerList, playerListForQuestioner[askingToIdx].username);
                    let playerListForAnswerer = listDeleteUser(playerList, playerListForQuestioner[askingToIdx].username);

                    let answerAllPlayers = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Select someone below in 120 Seconds. Enter his/her number below.')
                        .addFields(playerFields)

                    playerListForQuestioner[askingToIdx].send(answerAllPlayers).then((privM3) => {
                        let privCollector3 = privM3.channel.createMessageCollector(isNumericFilter, {
                            max: 1,
                            time: 120000
                        });

                        let privCollector3Error = privM3.channel.createMessageCollector(invalidFilter, {
                            time: 120000
                        });

                        privCollector3.on('collect', m => {
                            console.log(`Answer is ${playerListForAnswerer[m.content]}`);
                            channel.send(`A question is asked and ${playerListForQuestioner[askingToIdx]} said the answer is ${playerListForAnswerer[m.content]}\nNow they will play Rock Paper Scissors`);

                            //RECURSION
                            startRecursiveRPS(playerListForQuestioner[askingToIdx], playerListForAnswerer[m.content], askingQuestion, channel, playerSet);
                        });

                        privCollector3Error.on('collect', m => {
                            m.channel.send("You need to enter a valid number! Try again.");
                        });

                    });
                });

            }).catch((e) => {
                console.log("BİŞİ DEMEDİN!")
            });
        });

        privCollectorError.on('collect', m => {
            questioner.send("You need to enter a valid number! Try again.");
        });

    });

}

function fieldsExcluding(playerList, excludeName) {

    let playerFields = [];
    let a = 0;
    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].username != excludeName) {

            let field = {
                name: playerList[i].username,
                value: a.toString(),
                inline: true
            }
            a++;
            playerFields.push(field);
        }
    }

    return playerFields
}

function listDeleteUser(playerList, excludeName) {
    let tempList = [];

    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].username != excludeName) {
            tempList.push(playerList[i]);
        }
    }

    return tempList;
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function startRecursiveRPS(user1, user2, secQuestion, channel, playerSet) {
    startPvpRpsBetween(user1, user2)
        .then((winStatus) => {
            console.log("Game has been resolved to ", winStatus);
            if (winStatus == -1) {
                // User1 Wins
                channel.send(`❌  ${user2} **lost** the match, we will never know the question!`);
                user1.send(createEmbed(1));
                user2.send(createEmbed(-1));
            } else if (winStatus == 0) {
                // Draw
                channel.send("It was a draw, starting next round of rps!");
                user1.send(createEmbed(0));
                user2.send(createEmbed(0));

                startRecursiveRPS(user1, user2, secQuestion, channel, playerSet);
            } else {
                //User2 wins
                user1.send(createEmbed(-1));
                user2.send(createEmbed(1));
                channel.send(`☑  ${user2} **won** the match. The question asked was:\n**${secQuestion}**`);
            }
            if (winStatus != 0){
                channel.send("Wanna play again? *(Press 🔄 to restart, press ❌ to stop the game.)*").then((again) => {
                    again.react("🔄").then(again.react("❌")).then(() => {
                        const replayFilter = (reaction, user) => {
                            return ['🔄','❌'].includes(reaction.emoji.name) && (!user.bot);
                        };

                        again.awaitReactions(replayFilter, {
                                max: 1,
                                time: 60000,
                                errors: ['time']
                            })
                            .then(collected => {
                                const reaction = collected.first().emoji.name;
                                if (reaction == '🔄'){
                                    startGameWithSet(playerSet, channel);
                                }
                                else{
                                    channel.send("Ending the game!");
                                    endMessage(channel);
                                }
                            })
                            .catch(e => {
                                console.log("Süre bitti", e);
                                channel.send("Ending the game!");
                                endMessage(channel);
                            });
                    })
                });
            }
        });
}

async function startPvpRpsBetween(user1, user2) {
    return new Promise((resolve, reject) => {
        const emojis = ['🗻', '📜', '✂'];

        let p1Emoji = rpsSendPrivateMessage(user1);
        let p2Emoji = rpsSendPrivateMessage(user2);

        Promise.all([p1Emoji, p2Emoji]).then((values) => {
            console.log(values);

            let p1Idx = emojis.indexOf(values[0]);
            let p2Idx = emojis.indexOf(values[1]);

            let p1Name = user1.username;
            let p2Name = user2.username;

            //When both players played their moves
            let emojiText = `${p1Name} - ${p1Emoji}\n${p2Name} - ${p2Emoji}`;
            if (p1Idx == p2Idx) {
                console.log("Draw çıktı");
                resolve(0);
            } else if ((p2Idx + 1) % 3 == p1Idx) {
                console.log(user1.username, " won!");
                // Player1 win
                resolve(-1);
            } else {
                // Player2 win
                console.log(user2.username, " won!");
                resolve(1);
            }
        }).catch((e) => {
            console.log("WE GOT: ", e);
        });

    })
}


async function rpsSendPrivateMessage(user) {
    return new Promise((resolve, reject) => {
        console.log("Going to start rps to ", user.username);

        const privMesFilter = (reaction, user) => {
            return ["🗻", "📜", "✂"].includes(reaction.emoji.name) && (!user.bot);
        };

        user.send("Select one while your opponent does the same!").then(privM => {
            console.log("Sent message");
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
                resolve(react.emoji.name);
            })
        }).catch((e) => {
            console.log(e);
        })
    })
}

function createEmbed(winStatus) {
    let colorCode = (winStatus == 0 ) ? "#969C9F" : ((winStatus == 1) ? "#00D166" : "#FD0061");
    let text = (winStatus == 0 ) ? "**It's a draw**" : ((winStatus == 1) ? ("**You won!**") : ("**You lost!**"));
    let valText = (winStatus == 0 ) ? "Playing again!" : ((winStatus == 1) ? ("Congrats!") : ("Better luck next time."));

    const exampleEmbed = new Discord.MessageEmbed()
        .setColor(colorCode)
        .setURL("https://discord.js.org/")
        .addFields({
            name: text,
            value: valText
        })
    return exampleEmbed;
}

function endMessage(channel){
    channel.send("‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵‿︵\n");
}