const Discord = require('discord.js');


module.exports = async function (message, tokens) {
    const emojis = ["🗻","📜","✂"];

    message.react("🗻").then(() => message.react("📜")).then(() => message.react("✂"));

    const filter = (reaction, user) => {
        return ["🗻","📜","✂"].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    
    message.awaitReactions(filter, { max: 1, time: 20000, errors: ["time"] })
        .then(collected => {
            const reaction = collected.first();

                          
            let move = reaction.emoji.name;
            let playerIdx = emojis.indexOf(move); //console.log(emojis.indexOf(move));
            let botIdx = Math.floor(Math.random() * 3); //console.log(botIdx);              
            if (playerIdx == botIdx){
                // Draw
                createEmbed(0,message.author.username,message.channel,emojis[botIdx]); 
            }
            else if ((botIdx+1)%3 == playerIdx){
                // Player win
                createEmbed(1,message.author.username,message.channel,emojis[botIdx]);
            }
            else{
                // Bot win
                createEmbed(-1,message.author.username,message.channel,emojis[botIdx]);
            }                    
        })
        .catch(collected => {
            message.reply("You entered invalid reaction");
        });
}

function createEmbed(isWin, name, channel, emoji) {
    let colorCode = (isWin == -1) ? "#FD0061" : ((isWin == 0) ? "#91A6A6" : "#00D166");
    let text = (isWin == -1) ? ("** " + name + "** lose!") : ((isWin == 0) ? ("** Draw! **") : ("**" + name + "** win!"));
    // inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor(colorCode)
        .setURL("https://discord.js.org/")
        .addFields({
            name: emoji,
            value: text
        })

    channel.send(exampleEmbed);
}