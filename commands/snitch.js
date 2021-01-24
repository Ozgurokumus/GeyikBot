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

    // let playerFields = [];
    // for (let i = 0; i < playerList.length; i++) {
    //     let field = {
    //         name: playerList[i].username,
    //         value: i.toString(),
    //         inline: true
    //     }

    //     playerFields.push(field);
    // }

    let playerListForQuestioner = listDeleteUser(playerList,questioner.username); 
    let playerFields = fieldsExcluding(playerList,questioner.username);

    let questionerAllPlayers = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Select someone below in 60 Seconds')
        .addFields(playerFields)

    const isNumericFilter = (m) => isNumeric(m.content.trim());
    let privCollector;

    let askingToIdx;
    let askingQuestion;

    questioner.send(questionerAllPlayers).then((privM) => {
        privCollector = privM.channel.createMessageCollector(isNumericFilter, {
            max: 1,
            time: 60000
        });

        privCollector.on('collect', m => {
            askingToIdx = parseInt(m.content);
            console.log(`Collected ${m.content}`);

            console.log("Questioner Array: " + playerListForQuestioner);
            console.log("AskingToIdx: ", askingToIdx);
            const filter2 = (m) => true;
            questioner.send(`What do you want to ask to ${playerListForQuestioner[askingToIdx]}, it will be anonymous😉\nPlease answer in ${120} seconds`).then((privM2) => {
                let privCollector2 = privM2.channel.createMessageCollector(filter2, {
                    max: 1,
                    time: 120000,
                    errors: ["time"]
                });

                privCollector2.on('collect', m => {
                    console.log(`Your question to ${playerListForQuestioner[askingToIdx]} is ${m.content}`);
                    askingQuestion = m.content;
                    console.log(playerListForQuestioner[askingToIdx]);
                    console.log(typeof playerListForQuestioner[askingToIdx]);
                    playerListForQuestioner[askingToIdx].send(`An anonymous user asked you\n**${askingQuestion}** ,who is your answer?`);

                    playerFields = fieldsExcluding(playerList,playerListForQuestioner[askingToIdx].username);
                    let playerListForAnswerer = listDeleteUser(playerList,playerListForQuestioner[askingToIdx].username);

                    let answerAllPlayers = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Select someone below in 120 Seconds')
                        .addFields(playerFields)

                    playerListForQuestioner[askingToIdx].send(answerAllPlayers).then((privM3) => {
                        let privCollector3 = privM3.channel.createMessageCollector(isNumericFilter, {
                            max: 1,
                            time: 120000
                        });

                        privCollector3.on('collect', m => {
                            console.log(`Answer is ${playerListForAnswerer[m.content]}`);
                            channel.send(`A question is asked and ${playerListForQuestioner[askingToIdx]} said the answer is ${playerListForAnswerer[m.content]}\nNow they will play Rock Paper Scissors`);
                            let winStatus = startPvpRpsBetween(playerListForQuestioner[askingToIdx], playerListForAnswerer[m.content]);
                            while (winStatus != 0){
                                if (winStatus == -1){
                                    // Answerer Wins
                                    channel.send(`${playerListForAnswerer[m.content]} lost the match, we will never know the question!`);
                                }

                                else if (winStatus == 0){
                                    // Draw
                                    channel.send("It was a draw, starting next round of rps!");
                                    winStatus = startPvpRpsBetween(playerListForQuestioner[askingToIdx], playerListForAnswerer[m.content]);
                                }

                                else{
                                    channel.send(`${playerListForAnswerer[m.content]} won the match. The question asked was\n**${askingQuestion}**`);
                                }
                            }

                        });
                    });
                });
            }).catch((e) => {console.log("BİŞİ DEMEDİN!")});
        });
    });

}

function fieldsExcluding(playerList, excludeName){

    let playerFields = [];
    let a = 0;
    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].username!=excludeName){

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

function listDeleteUser(playerList, excludeName){
    let tempList = [];

    for (let i=0; i < playerList.length ;i++){
        if (playerList[i].username != excludeName){
            tempList.push(playerList[i]);
        }
        else{
            console.log("Deleted " + playerList[i].username);
        }
    }

    return tempList;
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

//⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ Özgürün alanı ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇

async function startPvpRpsBetween(user1, user2) {
    const emojis = ["🗻", "📜", "✂"];

    const privMesFilter = (reaction, user) => {
        return ["🗻", "📜", "✂"].includes(reaction.emoji.name) && user.id != "799787185402019880";
    };
 
    let answers = {}

    await rpsSendPrivateMessage(user1,answers);
    await rpsSendPrivateMessage(user2,answers);

    return new Promise(); //-1 if user1 wins, 0 if draw, 1 if user2 wins
}

function rpsSendPrivateMessage(user,answers){
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