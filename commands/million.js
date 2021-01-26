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
            if (parseInt(row["question_id"]) == questionId){ // While checking each line if questionId is the wanted one game starts.
                // Game Start
                console.log(row);

                questionObj = row; 
                questionEmbed = createQuestionEmbed(row);

                message.channel.send(questionEmbed).then(m => {
                    m.react("🇦").then(() => m.react("🇧"))
                                .then(() => m.react("🇨"))
                                .then(() => m.react("🇩"))
                    return m;
                }).then((m) => {
                    answerWait = m.createReactionCollector(answerFilter, { // Waiting for an answer
                        max: 1,
                        time: 180000
                    });
            
                    answerWait.on('collect', (reaction, user) => {
                        console.log(`${user.tag}'s answer is ${reaction.emoji.name}`);
                        if (questionObj["correct_choice"] == answerPairs[reaction.emoji.name]){
                            message.channel.send("BİLDİN! ☑");
                        }
                        else{
                            message.channel.send(`Yanlış cevap! ❌\nDoğru cevap: ${questionObj["correct_choice"]}`);
                        } 
                    });
                });
            }
        })
        .on('end', () => {
            console.log("Finished reading csv file!")
        });

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