const Discord = require('discord.js');
const csv = require('csv-parser');
const fs = require('fs');

module.exports = async function (message, tokens) {
    
    let player = message.author;
    let answer;

    console.log("Starting million for " + player.username);

    let questionObj; // Holds the current question row.  
    let questionId = getRndInteger(343,2265); // Question ids are between 343 and 2265. We take a random question id.
    let questionEmbed; // Embed message for question.

    console.log(questionId);
    const answerFilter = (reaction, user) => {
        return ["🇦", "🇧", "🇨", "🇩"].includes(reaction.emoji.name) && (!user.bot);
    };

    let answerPairs = {"🇦":"A","🇧":"B","🇨":"C","🇩":"D"}; // To compare given answer and correct answer. (emoji,string) pairs. 

    fs.createReadStream('question.csv') // Starts reading csv
        .pipe(csv())
        .on('data', (row) => {
            if (parseInt(row["question_id"]) == questionId){ // While checking each line, if questionId is the wanted one game starts.
                // Game Start
                console.log(row);
                isPlayed = false; // To check if anyone reacted to question in the end.
                questionObj = row; 
                questionEmbed = createQuestionEmbed(row);
                var currentTime = {"time":60} // DON'T FORGET TO CHANGE BOTH TIME VARIABLES

                message.channel.send(questionEmbed).then(m => {
                    m.react("🇦").then(() => m.react("🇧"))
                                .then(() => m.react("🇨"))
                                .then(() => m.react("🇩"))
                                .then(() => m.react("❓"))
                    return m;
                }).then((m) => {
                    answerWait = m.createReactionCollector(answerFilter, { // Waiting for an answer
                        max: 1,
                        time: 60000
                    });
            
                    answerWait.on('collect', (reaction, user) => {
                        isPlayed = true;
                        console.log(`${user.tag}'s answer is ${reaction.emoji.name}`);
                        if (reaction.emoji.name == "❓"){
                            message.channel.send(`${user} asked for the answer ❓\nCorrect answer was: ${questionObj["correct_choice"]}`);
                        }
                        else if (questionObj["correct_choice"] == answerPairs[reaction.emoji.name]){
                            message.channel.send(`${user} answered correct ☑`);
                        }
                        else{
                            message.channel.send(`${user} answered wrong ❌\nCorrect answer was: ${questionObj["correct_choice"]}`);
                        } 
                    });

                    answerWait.on('end', () => {
                        if (isPlayed == false) {
                            message.channel.send(`Time over :alarm_clock: \nCorrect answer was: ${questionObj["correct_choice"]}`);
                        }
                    });

                    
                    var interval = setInterval(() => {
                        currentTime.time--;
                        if (currentTime.time == 0){
                            clearInterval(interval);
                        }
                    },1000);

                });

                message.channel.send(`You have ${currentTime.time} seconds left to answer!`).then((msg) => {      
                    sendTime(msg,currentTime);
                });
            }
        })
        .on('end', () => {
            console.log("Finished reading csv file!")
        });

}

function sendTime(msg,count){

    if (count.time == 0 || isPlayed == true){
        msg.delete();
        return;
    }
    
    console.log(`${count.time} seconds left!`);
    setTimeout(() => {
        msg.edit(`You have ${count.time} seconds left to answer!`).then(() => {
            sendTime(msg,count);
        });
    },1000);

}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function createQuestionEmbed(row) {
    let colorCode = "#F8C300";
    let question = row["question"];
    let answers = `**A)** ${row["choiceA"]}\n**B)** ${row["choiceB"]}\n**C)** ${row["choiceC"]}\n**D)** ${row["choiceD"]}`;

    const exampleEmbed = new Discord.MessageEmbed()
        .setColor(colorCode)
        .setURL("https://discord.js.org/")
        .addFields({
            name: question,
            value: answers
        })
    return exampleEmbed;
}
